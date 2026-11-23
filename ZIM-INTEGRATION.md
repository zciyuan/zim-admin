# ZIM × GoWind Admin 集成说明

本目录是独立管理后台代码库，**不在 `ZIM` 主仓库内**，通过 `/admin` REST 调 ZIM 业务接口，禁止直连 ZIM 的 PostgreSQL/Mongo/Redis。

## 基线

- 上游：`https://gitee.com/tx7do/go-wind-admin`
- 本目录：`E:\Work\IM\zim-admin`
- 后端：`backend/`（Kratos + Ent）
- 前端：`frontend/admin`（Vue3 Vben）
- 独立 schema：`zim_admin`
- 多租户：GoWind 保留 `tenant_id`，ZIM 固定填 `1`

## ZIM 管理端契约

- 统一前缀：`/admin`
- 鉴权：GoWind 服务令牌 + mTLS；来源必须是 `zim-admin`
- 响应：`{ "code": 0, "data": ..., "message": "" }`
- 写操作：`Idempotency-Key`，24h
- 高危操作：二次确认 + 双人复核 + 审计

## 权限点

| 域 | 权限 |
|---|---|
| 用户 | `zim:user:list`、`zim:user:ban`、`zim:user:kick`、`zim:user:reset_pwd` |
| 群 | `zim:group:list`、`zim:group:dismiss`、`zim:group:transfer`、`zim:group:mute` |
| 家庭组 | `zim:family:list`、`zim:family:dismiss` |
| 消息 | `zim:msg:query`、`zim:msg:recall`、`zim:msg:delete` |
| 敏感词 | `zim:sensitive:list`、`zim:sensitive:write` |
| 推送 | `zim:push:cert`、`zim:push:test` |
| 配置 | `zim:config:read`、`zim:config:write` |
| 审核 | `zim:audit:report`、`zim:audit:content` |
| 审计 | `zim:oplog:list` |

## T37 落地步骤

1. 在 GoWind `backend` 建 `zim_admin` schema，导入 GoWind RBAC 基础表；
2. 将上面的权限点注册为菜单/按钮权限；
3. 新建 `zim` 管理 API 客户端，base URL 指向 `zim-api`；
4. 前端保持 Vben 的 `{code,data,message}` 解包与分页适配；
5. 先实现只读用户/群/消息查询，再开放封禁、解散、撤回等高危操作；
6. 登录冒烟：管理员登录 → 空业务菜单可见 → 用户列表 200。

## 当前状态

- 上游代码已克隆，**未改上游业务代码**
- ZIM 管理 API 尚未实现 `/admin`
- 本机未启动 GoWind 后端/前端
- 后续将本目录上传到独立仓库/服务器后继续 T38–T41

## 本机联调记录（2026-11-15）

- 依赖：`backend/docker-compose.yaml` 的 postgres/redis/minio，映射 5432/6379/9000
- 配置：复制 `configs` 为 `configs-local`，host 改为 `127.0.0.1`
- 导入 `backend/sql/postgresql-demo-data.sql`，租户 `super`，管理员 `admin/admin`
- 本地关闭验证码：`CaptchaEnabled=false`（仅开发环境）
- 登录：

```http
POST http://127.0.0.1:7788/admin/v1/login
{"grant_type":"password","username":"admin","password":"<rsa-v1 envelope>"}
```

- 路由：

```http
GET http://127.0.0.1:7788/admin/v1/routes
Authorization: Bearer <access_token>
```

- 已实测：登录 200，`/admin/v1/routes` 返回 GoWind 默认菜单
- 下一步：把 ZIM 权限点/菜单写入 GoWind，替换默认菜单

## 权限导入结果（2026-11-15）

- 通过 `POST /admin/v1/permissions` 导入 22 个 `zim:*` 权限点
- 结果：22/22 HTTP 200
- 登录：`admin/admin` + RSA 信封
- 菜单：`GET /admin/v1/routes` 返回 200（当前为 GoWind 默认菜单）
- 下一步：创建 ZIM 菜单/角色，绑定权限点

## 权限真实下发（2026-11-15）

- Vben 登录后从 GoWind `/admin/v1/perm-codes` 获取权限码
- 只把 `zim:*` 写入 `zim_permissions` Cookie
- Vite `/zim-admin` 代理读取 Cookie，注入 `X-ZIM-Admin-Permissions`
- 已移除开发期 `X-ZIM-Admin-Permissions: *`
- ZIM `/admin` 逐接口校验权限，无权限返回 403

## 菜单裁剪

- 仅保留 `/dashboard` 与 `/zim` 菜单
- 其余 GoWind 默认菜单已置 `OFF`
- Vben 侧边栏现在只显示：

```text
概览
ZIM 管理
```

- 未删除 GoWind 后端模块代码，只做菜单级下线，避免破坏上游结构
