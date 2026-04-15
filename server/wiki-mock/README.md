# Mock Wiki HTTP（wiki-mock）

本地/CI 模拟 Wiki 后端：直接托管场景 JSON 与静态资源，**不**拼接注册表、**不**裁剪 bundle。

## REST（`/preview-api`）

| 方法 | 路径 | 响应 |
|------|------|------|
| GET | `/preview-api/scenes` | `string[]` 场景 id 列表 |
| GET | `/preview-api/scenes/:sceneId` | 场景 JSON 原文（`StructureData` 或 `World`） |
| GET | `/preview-api/scenes/:sceneId/bundle` | 与上相同（兼容旧路径） |
| GET | `/preview-api/resources/*` | 资源文件（相对 `data/resources` 根）；如 `.../assets/<ns>/textures/...png` |

- **场景**：仓库 `data/scenes/<id>.json`（或 `data/scenes/<id>/document.json`）。

## Namespace / Data（与 `src/preview/namespaceHttp.ts` 一致）

- **成功**：HTTP 200，body 为 `{ "success": true, "data": ... }`。
- **失败**：HTTP 4xx/5xx，body 为 `{ "success": false, "error": { "code": string, "message": string } }`。

| 方法 | 路径 | `data` 含义 |
|------|------|-------------|
| GET | `/namespace/data` | `Data` 命名空间文档数组 |
| GET | `/namespace/data/{title}` | 单条文档 |
| GET | `/namespace/data_aggr/{aggrs}` | 聚合结果；`aggrs` 为 URL 安全 Base64 的 pipeline JSON |

## 环境变量

- `PREVIEW_HTTP_PORT`：固定监听端口；未设置时在 8787–8791 间尝试。
- `PREVIEW_DATA_SCENES`：覆盖场景目录（默认 `data/scenes`，内含 `*.json`）。
- `PREVIEW_DATA_RESOURCES`：覆盖资源根目录（默认 `data/resources`）。

## 启动

```bash
npm run preview:http
```

（内部为 `tsx server/wiki-mock/preview-http.mjs`。）Vite 开发时将 `/preview-api` 与 `/namespace` 代理到本进程；监听成功后写入仓库根 `.wmr-preview-port`。
