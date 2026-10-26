# Django REST API — 项目 CLAUDE.md

> 这是一个使用 Django REST Framework (DRF)、PostgreSQL 和 Celery 的真实 API 项目示例。
> 请将此文件复制到项目根目录，并根据你的服务进行自定义。

## 项目概览 (Project Overview)

**技术栈 (Stack):** Python 3.12+, Django 5.x, Django REST Framework, PostgreSQL, Celery + Redis, pytest, Docker Compose

**架构 (Architecture):** 采用领域驱动设计（Domain-driven design），按业务领域划分应用（Apps）。DRF 用于 API 层，Celery 处理异步任务，pytest 用于测试。所有端点均返回 JSON — 不进行模板渲染。

## 关键规则 (Critical Rules)

### Python 规范 (Python Conventions)

- 所有函数签名必须包含类型提示（Type hints）— 使用 `from __future__ import annotations`
- 禁止使用 `print()` 语句 — 使用 `logging.getLogger(__name__)`
- 使用 f-strings 进行字符串格式化，绝不使用 `%` 或 `.format()`
- 使用 `pathlib.Path` 而非 `os.path` 进行文件操作
- 导入顺序由 isort 排序：标准库、第三方库、本地库（由 ruff 强制执行）

### 数据库 (Database)

- 所有查询必须使用 Django ORM — 仅在 `.raw()` 和参数化查询中使用原生 SQL
- 迁移文件（Migrations）必须提交至 git — 严禁在生产环境使用 `--fake`
- 使用 `select_related()` 和 `prefetch_related()` 以防止 N+1 查询问题
- 所有模型必须包含 `created_at` 和 `updated_at` 自动字段
- 在 `filter()`、`order_by()` 或 `WHERE` 子句中使用的任何字段都必须建立索引

```python
# 错误做法：N+1 查询
orders = Order.objects.all()
for order in orders:
    print(order.customer.name)  # 为每个订单请求一次数据库

# 正确做法：通过 join 进行单次查询
orders = Order.objects.select_related("customer").all()
```

### 身份验证 (Authentication)

- 通过 `djangorestframework-simplejwt` 实现 JWT — 访问令牌（15 分钟）+ 刷新令牌（7 天）
- 每个视图（View）都必须配置权限类（Permission classes）— 绝不依赖默认配置
- 以 `IsAuthenticated` 为基类，为对象级访问添加自定义权限
- 启用令牌黑名单（Token blacklisting）以支持注销

### 序列化器 (Serializers)

- 简单的 CRUD 使用 `ModelSerializer`，复杂的验证使用 `Serializer`
- 当输入/输出结构不同时，拆分读（Read）和写（Write）序列化器
- 在序列化器层级进行验证，而非在视图中 — 视图应当保持轻量（Thin views）

```python
class CreateOrderSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, max_value=100)

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value, active=True).exists():
            raise serializers.ValidationError("Product not found or inactive")
        return value

class OrderDetailSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "customer", "product", "quantity", "total", "status", "created_at"]
```

### 错误处理 (Error Handling)

- 使用 DRF 异常处理器（Exception handler）以获得一致的错误响应
- 在 `core/exceptions.py` 中为业务逻辑定义自定义异常
- 严禁向客户端泄露内部错误详情

```python
# core/exceptions.py
from rest_framework.exceptions import APIException

class InsufficientStockError(APIException):
    status_code = 409
    default_detail = "Insufficient stock for this order"
    default_code = "insufficient_stock"
```

### 代码风格 (Code Style)

- 代码或注释中不得出现表情符号（Emojis）
- 最大行宽：120 字符（由 ruff 强制执行）
- 类名使用 PascalCase，函数/变量名使用 snake_case，常量使用 UPPER_SNAKE_CASE
- 视图应保持轻量 — 业务逻辑应存在于服务函数（Service functions）或模型方法中

## 文件结构 (File Structure)

```
config/
  settings/
    base.py              # 共享设置
    local.py             # 开发环境覆盖 (DEBUG=True)
    production.py        # 生产环境设置
  urls.py                # 根路由配置
  celery.py              # Celery 应用配置
apps/
  accounts/              # 用户认证、注册、个人资料
    models.py
    serializers.py
    views.py
    services.py          # 业务逻辑
    tests/
      test_views.py
      test_services.py
      factories.py       # Factory Boy 工厂类
  orders/                # 订单管理
    models.py
    serializers.py
    views.py
    services.py
    tasks.py             # Celery 任务
    tests/
  products/              # 产品目录
    models.py
    serializers.py
    views.py
    tests/
core/
  exceptions.py          # 自定义 API 异常
  permissions.py         # 共享权限类
  pagination.py          # 自定义分页
  middleware.py          # 请求日志、计时
  tests/
```

## 关键模式 (Key Patterns)

### 服务层 (Service Layer)

```python
# apps/orders/services.py
from django.db import transaction

def create_order(*, customer, product_id: uuid.UUID, quantity: int) -> Order:
    """创建订单，包含库存验证和付款冻结。"""
    product = Product.objects.select_for_update().get(id=product_id)

    if product.stock < quantity:
        raise InsufficientStockError()

    with transaction.atomic():
        order = Order.objects.create(
            customer=customer,
            product=product,
            quantity=quantity,
            total=product.price * quantity,
        )
        product.stock -= quantity
        product.save(update_fields=["stock", "updated_at"])

    # 异步任务：发送确认邮件
    send_order_confirmation.delay(order.id)
    return order
```

### 视图模式 (View Pattern)

```python
# apps/orders/views.py
class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_serializer_class(self):
        if self.action == "create":
            return CreateOrderSerializer
        return OrderDetailSerializer

    def get_queryset(self):
        return (
            Order.objects
            .filter(customer=self.request.user)
            .select_related("product", "customer")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        order = create_order(
            customer=self.request.user,
            product_id=serializer.validated_data["product_id"],
            quantity=serializer.validated_data["quantity"],
        )
        serializer.instance = order
```

### 测试模式 (Test Pattern - pytest + Factory Boy)

```python
# apps/orders/tests/factories.py
import factory
from apps.accounts.tests.factories import UserFactory
from apps.products.tests.factories import ProductFactory

class OrderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "orders.Order"

    customer = factory.SubFactory(UserFactory)
    product = factory.SubFactory(ProductFactory, stock=100)
    quantity = 1
    total = factory.LazyAttribute(lambda o: o.product.price * o.quantity)

# apps/orders/tests/test_views.py
import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
class TestCreateOrder:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(self.user)

    def test_create_order_success(self):
        product = ProductFactory(price=29_99, stock=10)
        response = self.client.post("/api/orders/", {
            "product_id": str(product.id),
            "quantity": 2,
        })
        assert response.status_code == 201
        assert response.data["total"] == 59_98

    def test_create_order_insufficient_stock(self):
        product = ProductFactory(stock=0)
        response = self.client.post("/api/orders/", {
            "product_id": str(product.id),
            "quantity": 1,
        })
        assert response.status_code == 409

    def test_create_order_unauthenticated(self):
        self.client.force_authenticate(None)
        response = self.client.post("/api/orders/", {})
        assert response.status_code == 401
```

## 环境变量 (Environment Variables)

```bash
# Django
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=api.example.com

# 数据库
DATABASE_URL=postgres://user:pass@localhost:5432/myapp

# Redis (Celery 代理 + 缓存)
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_ACCESS_TOKEN_LIFETIME=15       # 分钟
JWT_REFRESH_TOKEN_LIFETIME=10080   # 分钟 (7 天)

# 邮件
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.example.com
```

## 测试策略 (Testing Strategy)

```bash
# 运行所有测试
pytest --cov=apps --cov-report=term-missing

# 运行特定应用的测试
pytest apps/orders/tests/ -v

# 并行执行测试
pytest -n auto

# 仅运行上次失败的测试
pytest --lf
```

## ECC 工作流 (ECC Workflow)

```bash
# 规划
/plan "集成 Stripe 并添加订单退款系统"

# 基于 TDD 的开发
/tdd                    # 基于 pytest 的 TDD 工作流

# 审查
/python-review          # Python 专用代码审查
/security-scan          # Django 安全审计
/code-review            # 通用质量检查

# 验证
/verify                 # 构建、代码检查、测试、安全扫描
```

## Git 工作流 (Git Workflow)

- `feat:` 新功能，`fix:` 错误修复，`refactor:` 代码重构
- 从 `main` 分支拉取功能分支，必须通过 PR 合并
- CI 环境：ruff (代码检查 + 格式化), mypy (类型检查), pytest (测试), safety (依赖检查)
- 部署：Docker 镜像，通过 Kubernetes 或 Railway 管理
