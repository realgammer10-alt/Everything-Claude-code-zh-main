/**
 * Tests for scripts/health-monitor.js
 *
 * Run with: node tests/scripts/health-monitor.test.js
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const {
  checkEndpoint,
  formatDashboard,
  loadConfig,
  parseArgs,
  runMonitor,
  validateConfig
} = require('../../scripts/health-monitor');

async function withServer(handler, fn) {
  const server = http.createServer(handler);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  try {
    const address = server.address();
    await fn(`http://127.0.0.1:${address.port}`);
  } finally {
    const closed = new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }
    await closed;
  }
}

async function runTests() {
  console.log('\n=== Testing health-monitor.js ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  \u2713 ${name}`);
      passed++;
    } catch (err) {
      console.log(`  \u2717 ${name}`);
      console.log(`    Error: ${err.message}`);
      failed++;
    }
  }

  console.log('Configuration:');

  await test('parses config path and one-shot mode', () => {
    assert.deepStrictEqual(parseArgs(['--config', 'healthchecks.json', '--once']), {
      configPath: 'healthchecks.json',
      once: true,
      help: false
    });
  });

  await test('rejects unknown and incomplete CLI arguments', () => {
    assert.throws(() => parseArgs(['--unexpected']), /Unknown option/);
    assert.throws(() => parseArgs(['--config']), /requires a path/);
  });

  await test('validates and defaults endpoint settings', () => {
    const config = validateConfig({
      checks: [{ name: 'API', url: 'http://localhost:3000/health' }]
    });
    assert.strictEqual(config.intervalMs, 5000);
    assert.strictEqual(config.timeoutMs, 2000);
    assert.deepStrictEqual(config.checks[0], {
      name: 'API',
      url: 'http://localhost:3000/health',
      expectedStatus: 200
    });
  });

  await test('rejects invalid, duplicate, or credential-bearing endpoint definitions', () => {
    assert.throws(() => validateConfig({ checks: [] }), /at least one endpoint/);
    assert.throws(() => validateConfig({
      checks: [{ name: 'API', url: 'file:///etc/passwd' }]
    }), /HTTP or HTTPS/);
    assert.throws(() => validateConfig({
      checks: [{ name: 'API', url: 'http://user:pass@example.com/health' }]
    }), /credentials/);
    assert.throws(() => validateConfig({
      checks: [
        { name: 'API', url: 'http://localhost/health' },
        { name: 'api', url: 'http://localhost/ready' }
      ]
    }), /unique/);
    assert.throws(() => validateConfig({
      intervalMs: 0,
      checks: [{ name: 'API', url: 'http://localhost/health' }]
    }), /intervalMs/);
  });

  await test('loads JSON config and reports missing or invalid files', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'health-monitor-'));
    const configPath = path.join(tempDir, 'healthchecks.json');
    try {
      fs.writeFileSync(configPath, JSON.stringify({
        checks: [{ name: 'API', url: 'http://localhost:3000/health' }]
      }));
      assert.strictEqual(loadConfig(configPath).checks[0].name, 'API');
      fs.writeFileSync(configPath, '{invalid');
      assert.throws(() => loadConfig(configPath), /Invalid JSON/);
      assert.throws(() => loadConfig(path.join(tempDir, 'missing.json')), /Cannot read config file/);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  console.log('\nHealth checks:');

  await test('reports successful HTTP responses and latency', async () => {
    await withServer((req, res) => {
      res.writeHead(200);
      res.end('ok');
    }, async baseUrl => {
      const result = await checkEndpoint({
        name: 'API',
        url: `${baseUrl}/health`,
        expectedStatus: 200
      }, 1000);
      assert.strictEqual(result.status, 'UP');
      assert.strictEqual(result.statusCode, 200);
      assert.strictEqual(typeof result.durationMs, 'number');
      assert.strictEqual(result.error, null);
    });
  });

  await test('marks unexpected status codes as unhealthy', async () => {
    await withServer((req, res) => {
      res.writeHead(503);
      res.end('unavailable');
    }, async baseUrl => {
      const result = await checkEndpoint({
        name: 'API',
        url: baseUrl,
        expectedStatus: 200
      }, 1000);
      assert.strictEqual(result.status, 'DOWN');
      assert.strictEqual(result.statusCode, 503);
      assert.match(result.error, /Expected HTTP 200, received 503/);
    });
  });

  await test('reports connection failures without throwing', async () => {
    const result = await checkEndpoint({
      name: 'API',
      url: 'http://127.0.0.1:1/health',
      expectedStatus: 200
    }, 1000);
    assert.strictEqual(result.status, 'DOWN');
    assert.match(result.error, /request failed/i);
  });

  await test('aborts requests that exceed the configured timeout', async () => {
    await withServer((req, res) => {
      setTimeout(() => {
        if (!res.destroyed) res.end('late');
      }, 100);
    }, async baseUrl => {
      const result = await checkEndpoint({
        name: 'Slow API',
        url: baseUrl,
        expectedStatus: 200
      }, 20);
      assert.strictEqual(result.status, 'DOWN');
      assert.match(result.error, /timed out after 20 ms/);
    });
  });

  await test('runs a single dashboard cycle and returns a failing exit status for unhealthy APIs', async () => {
    await withServer((req, res) => {
      res.writeHead(503);
      res.end();
    }, async baseUrl => {
      const output = [];
      const exitCode = await runMonitor({
        checks: [{ name: 'API', url: baseUrl, expectedStatus: 200 }],
        timeoutMs: 1000,
        intervalMs: 5000
      }, {
        once: true,
        isTTY: true,
        output: text => output.push(text)
      });
      assert.strictEqual(exitCode, 1);
      assert.strictEqual(output.length, 1);
      assert.match(output[0], /^\x1b\[2J\x1b\[HAPI Health Monitor \| DEGRADED \| 0 UP, 1 DOWN/);
      assert.match(output[0], /Expected HTTP 200, received 503/);
    });
  });

  await test('renders status, latency, and failure details in dashboard output', () => {
    const output = formatDashboard([
      {
        name: 'API',
        status: 'UP',
        statusCode: 200,
        durationMs: 12,
        checkedAt: '2026-10-23T12:00:00.000Z',
        error: null
      },
      {
        name: 'Worker',
        status: 'DOWN',
        statusCode: null,
        durationMs: 25,
        checkedAt: '2026-10-23T12:00:01.000Z',
        error: 'request timed out'
      }
    ], '2026-10-23T12:00:02.000Z');
    assert.match(output, /API Health Monitor/);
    assert.match(output, /DEGRADED\s+\|\s+1 UP, 1 DOWN/);
    assert.match(output, /API\s+\|\s+UP\s+\|\s+200\s+\|\s+12 ms/);
    assert.match(output, /Worker\s+\|\s+DOWN/);
    assert.match(output, /request timed out/);
  });

  console.log(`\nPassed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) process.exitCode = 1;
}

runTests().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
