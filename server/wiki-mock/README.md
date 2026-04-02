# Mock Wiki HTTP（wiki-mock）

独立 Node 进程，**不引用**仓库 `src/`。用于本地/CI 模拟 Wiki 后端向渲染器提供数据。

## REST 契约（与 `src/preview/fetchWikiBundle.ts` 一致）

| 方法 | 路径 | 响应 |
|------|------|------|
| GET | `/preview-api/scenes` | `string[]` 场景 id 列表 |
| GET | `/preview-api/scenes/:sceneId/bundle` | `WikiRenderBundle` JSON（可按 palette 裁剪注册表） |

场景根目录：仓库 `data/server/scenes/<id>/` 下四文件 `document.json`、`block_registry.json`、`material_registry.json`、`model_registry.json`。

## 环境变量

- `PREVIEW_HTTP_PORT`：固定监听端口；未设置时在 8787–8791 间尝试。
- `PREVIEW_DATA_SCENES`：覆盖场景根目录。
- `PREVIEW_BUNDLE_NO_SLICE=1`：关闭按 palette 裁剪（调试用）。

## 启动

```bash
node server/wiki-mock/preview-http.mjs
```

Vite 开发时将 `/preview-api` 代理到本进程；监听成功后写入仓库根 `.wmr-preview-port` 供代理读取端口。
