# Mock Wiki HTTP（wiki-mock）

独立 Node 进程，**不引用**仓库 `src/`。用于本地/CI 模拟 Wiki 后端向渲染器提供数据。

## REST 契约（与 `src/preview/fetchWikiBundle.ts` 一致）

| 方法 | 路径 | 响应 |
|------|------|------|
| GET | `/preview-api/scenes` | `string[]` 场景 id 列表 |
| GET | `/preview-api/scenes/:sceneId/bundle` | `WikiRenderBundle` JSON（可按 palette 裁剪注册表） |

场景根目录：仓库 `data/server/scenes/<id>/` 下四文件 `document.json`、`block_registry.json`、`material_registry.json`、`model_registry.json`。

## 灰机契约（Namespace / Data；与 `src/preview/huijiNamespace.ts` 一致）

Mock 的 **JSON 外层**对齐灰机常见写法，便于渲染器同一套解析逻辑对接线上：

- **成功**：HTTP 200，body 为 `{ "success": true, "data": ... }`。
- **失败**：HTTP 4xx/5xx（如单条不存在为 404），body 为 `{ "success": false, "error": { "code": string, "message": string } }`。

| 方法 | 路径 | `data` 含义 |
|------|------|-------------|
| GET | `/namespace/data` | `Data` 命名空间文档数组（内存由 `data/server/scenes` 合法场景构建）。 |
| GET | `/namespace/data/{title}` | 单条文档；`title` 为路径段，需 URL 解码（与文档 `title` 字段一致）。 |
| GET | `/namespace/data_aggr/{aggrs}` | 聚合结果数组。`aggrs` 为 **URL 安全 Base64**（无 `+`/`/`，`-`/`_`）编码的 **UTF-8 JSON 数组**，即 Mongo 风格 pipeline；服务端在内存文档上执行（见 `namespaceMemory.mjs`）。 |

支持的阶段：`$match`、`$project`、`$sort`、`$limit`、`$count`；未支持的阶段返回 **400**，`success: false`。

## 环境变量

- `PREVIEW_HTTP_PORT`：固定监听端口；未设置时在 8787–8791 间尝试。
- `PREVIEW_DATA_SCENES`：覆盖场景根目录。
- `PREVIEW_BUNDLE_NO_SLICE=1`：关闭按 palette 裁剪（调试用）。

## 启动

```bash
node server/wiki-mock/preview-http.mjs
```

Vite 开发时将 `/preview-api` 与 `/namespace` 代理到本进程；监听成功后写入仓库根 `.wmr-preview-port` 供代理读取端口。
