#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const { performance } = require('perf_hooks');

const DEFAULT_INTERVAL_MS = 5000;
const DEFAULT_TIMEOUT_MS = 2000;
const MAX_CHECKS = 100;
const MAX_NAME_LENGTH = 64;
const MAX_URL_LENGTH = 2048;

function parseArgs(args) {
  const options = { configPath: null, once: false, help: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--once') {
      if (options.once) throw new Error('--once may only be specified once');
      options.once = true;
    } else if (arg === '--config') {
      if (options.configPath) throw new Error('--config may only be specified once');
      const value = args[++i];
      if (!value || value.startsWith('--')) {
        throw new Error('--config requires a path');
      }
      options.configPath = value;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!options.help && !options.configPath) {
    throw new Error('A config file is required. Use --config <path>.');
  }
  return options;
}

function validateConfig(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Configuration must be a JSON object');
  }

  const allowedConfigKeys = new Set(['intervalMs', 'timeoutMs', 'checks']);
  for (const key of Object.keys(input)) {
    if (!allowedConfigKeys.has(key)) {
      throw new Error(`Unknown configuration option: ${key}`);
    }
  }

  const intervalMs = input.intervalMs === undefined ? DEFAULT_INTERVAL_MS : input.intervalMs;
  const timeoutMs = input.timeoutMs === undefined ? DEFAULT_TIMEOUT_MS : input.timeoutMs;
  if (!Number.isInteger(intervalMs) || intervalMs < 250 || intervalMs > 3600000) {
    throw new Error('intervalMs must be an integer between 250 and 3600000');
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 120000) {
    throw new Error('timeoutMs must be an integer between 100 and 120000');
  }
  if (!Array.isArray(input.checks) || input.checks.length === 0) {
    throw new Error('checks must contain at least one endpoint');
  }
  if (input.checks.length > MAX_CHECKS) {
    throw new Error(`checks cannot contain more than ${MAX_CHECKS} endpoints`);
  }

  const seenNames = new Set();
  const checks = input.checks.map((check, index) => {
    if (!check || typeof check !== 'object' || Array.isArray(check)) {
      throw new Error(`checks[${index}] must be an object`);
    }
    for (const key of Object.keys(check)) {
      if (!['name', 'url', 'expectedStatus'].includes(key)) {
        throw new Error(`Unknown option in checks[${index}]: ${key}`);
      }
    }

    if (typeof check.name !== 'string' || !check.name.trim() ||
        check.name.trim().length > MAX_NAME_LENGTH || /\p{Cc}/u.test(check.name)) {
      throw new Error(`checks[${index}].name must be 1-${MAX_NAME_LENGTH} printable characters`);
    }
    const name = check.name.trim();
    const normalizedName = name.toLowerCase();
    if (seenNames.has(normalizedName)) {
      throw new Error(`Check names must be unique: ${name}`);
    }
    seenNames.add(normalizedName);

    if (typeof check.url !== 'string' || check.url.length > MAX_URL_LENGTH) {
      throw new Error(`checks[${index}].url must be a URL no longer than ${MAX_URL_LENGTH} characters`);
    }
    let endpoint;
    try {
      endpoint = new URL(check.url);
    } catch (_error) {
      throw new Error(`checks[${index}].url must be a valid absolute URL`);
    }
    if (endpoint.protocol !== 'http:' && endpoint.protocol !== 'https:') {
      throw new Error(`checks[${index}].url must use HTTP or HTTPS`);
    }
    if (endpoint.username || endpoint.password) {
      throw new Error(`checks[${index}].url must not include credentials`);
    }

    const expectedStatus = check.expectedStatus === undefined ? 200 : check.expectedStatus;
    if (!Number.isInteger(expectedStatus) || expectedStatus < 100 || expectedStatus > 599) {
      throw new Error(`checks[${index}].expectedStatus must be an integer between 100 and 599`);
    }

    return { name, url: endpoint.toString(), expectedStatus };
  });

  return { intervalMs, timeoutMs, checks };
}

function loadConfig(configPath, cwd) {
  const resolvedPath = path.resolve(cwd || process.cwd(), configPath);
  let contents;
  try {
    contents = fs.readFileSync(resolvedPath, 'utf8');
  } catch (error) {
    throw new Error(`Cannot read config file "${resolvedPath}": ${error.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(contents);
  } catch (error) {
    throw new Error(`Invalid JSON in config file "${resolvedPath}": ${error.message}`);
  }
  return validateConfig(parsed);
}

async function checkEndpoint(check, timeoutMs, now) {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) {
    throw new Error('timeoutMs must be a positive integer');
  }

  const startedAt = performance.now();
  const checkedAt = (now || Date.now)();
  let timedOut = false;

  try {
    const endpoint = new URL(check.url);
    const transport = endpoint.protocol === 'https:' ? https : http;
    const statusCode = await new Promise((resolve, reject) => {
      const request = transport.request(endpoint, { method: 'GET', agent: false }, response => {
        clearTimeout(timer);
        response.resume();
        resolve(response.statusCode || 0);
      });
      const timer = setTimeout(() => {
        timedOut = true;
        request.destroy(new Error('request timed out'));
      }, timeoutMs);
      request.once('error', error => {
        clearTimeout(timer);
        reject(error);
      });
      request.end();
    });
    const durationMs = Math.max(0, Math.round(performance.now() - startedAt));
    const healthy = statusCode === check.expectedStatus;
    return {
      name: check.name,
      status: healthy ? 'UP' : 'DOWN',
      statusCode,
      durationMs,
      checkedAt: new Date(checkedAt).toISOString(),
      error: healthy ? null :
        `Expected HTTP ${check.expectedStatus}, received ${statusCode}`
    };
  } catch (error) {
    const durationMs = Math.max(0, Math.round(performance.now() - startedAt));
    return {
      name: check.name,
      status: 'DOWN',
      statusCode: null,
      durationMs,
      checkedAt: new Date(checkedAt).toISOString(),
      error: timedOut
        ? `Request timed out after ${timeoutMs} ms`
        : `Request failed: ${error.message || 'network error'}`
    };
  }
}

function formatDashboard(results, updatedAt) {
  const healthyCount = results.filter(result => result.status === 'UP').length;
  const unhealthyCount = results.length - healthyCount;
  const overallStatus = unhealthyCount === 0 ? 'HEALTHY' : 'DEGRADED';
  const lines = [
    `API Health Monitor | ${overallStatus} | ${healthyCount} UP, ${unhealthyCount} DOWN | Updated ${updatedAt || new Date().toISOString()}`,
    'Service                  | Status | HTTP  | Latency  | Last check                | Details',
    '-------------------------|--------|-------|----------|---------------------------|------------------------------'
  ];

  for (const result of results) {
    const name = result.name.slice(0, 24).padEnd(24);
    const status = result.status.padEnd(6);
    const statusCode = String(result.statusCode === null ? '-' : result.statusCode).padEnd(5);
    const latency = `${result.durationMs} ms`.padEnd(8);
    const checkedAt = result.checkedAt;
    const details = (result.error || 'Expected response received').slice(0, 120);
    lines.push(`${name} | ${status} | ${statusCode} | ${latency} | ${checkedAt} | ${details}`);
  }
  return lines.join('\n');
}

function sleep(ms, signal) {
  if (signal && signal.aborted) return Promise.resolve();
  return new Promise(resolve => {
    let timer;
    const finish = () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener('abort', finish);
      resolve();
    };
    timer = setTimeout(finish, ms);
    if (signal) {
      signal.addEventListener('abort', finish, { once: true });
      if (signal.aborted) finish();
    }
  });
}

async function runMonitor(config, options) {
  const settings = options || {};
  const output = settings.output || console.log;
  const signal = settings.signal;
  let results;

  do {
    results = await Promise.all(config.checks.map(check =>
      checkEndpoint(check, config.timeoutMs)
    ));
    const dashboard = formatDashboard(results);
    output(settings.isTTY ? `\x1b[2J\x1b[H${dashboard}` : dashboard);

    if (settings.once) {
      return results.some(result => result.status !== 'UP') ? 1 : 0;
    }
    await sleep(config.intervalMs, signal);
  } while (!signal || !signal.aborted);

  return 0;
}

function showHelp() {
  return `API Health Monitor

Usage:
  node scripts/health-monitor.js --config <path> [--once]

Options:
  --config <path>  JSON file describing endpoints and polling settings
  --once           Run one check cycle and exit (1 if any endpoint is unhealthy)
  --help           Show this help message

Config example:
  {
    "intervalMs": 5000,
    "timeoutMs": 2000,
    "checks": [
      { "name": "Web API", "url": "http://localhost:3000/health", "expectedStatus": 200 }
    ]
  }
`;
}

async function main(args) {
  const options = parseArgs(args);
  if (options.help) {
    console.log(showHelp());
    return 0;
  }

  const config = loadConfig(options.configPath);
  const controller = new AbortController();
  const stop = () => controller.abort();
  process.once('SIGINT', stop);
  try {
    return await runMonitor(config, {
      once: options.once,
      isTTY: Boolean(process.stdout.isTTY),
      signal: controller.signal
    });
  } finally {
    process.removeListener('SIGINT', stop);
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).then(code => {
    if (code) process.exitCode = code;
  }).catch(error => {
    console.error(`Health monitor error: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  checkEndpoint,
  formatDashboard,
  loadConfig,
  main,
  parseArgs,
  runMonitor,
  showHelp,
  validateConfig
};
