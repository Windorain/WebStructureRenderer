# 灰机零件集成：Wiki 渲染包

服务端一次响应提供 `WikiRenderBundle` 形状（见 `src/render/types.ts`）：

- `document`：顶层 JSON，为 **StructureData**（与导出 `export.json` 同形）或 **World**（多帧；当前需至少一帧含内嵌 `structure`）
- `blockRegistry`：本次渲染所需的 `block_registry` 切片（调用方已定稿，库内不再叠「全局底稿 / overlay」）
- `materialRegistry`：本次渲染所需的 `material_registry` 切片
- 可选：`bundleId`、`assetsBaseUrl`、`payloadSchemaVersion`

零件侧流程：**请求接口（例如按场景名）→ 将 JSON 交给渲染库**：

```ts
import { resolveWikiRenderBundle, validateWikiRenderBundle } from '@/render/pipeline'

const bundle = await fetch('/api/...').then((r) => r.json())
validateWikiRenderBundle(bundle)
const { definition, materialRegistry } = resolveWikiRenderBundle(bundle)
// definition → 网格；materialRegistry → SimpleMaterialLibrary
```

`document` 为 World 且需指定帧时，可传第二参 `frameIndex`：`resolveWikiRenderBundle(bundle, frameIndex)`。

若构建为 IIFE 全局，可使用 `WikiMultiStructureRender.resolveWikiRenderBundle`（见 `src/main.ts` 导出）。

**不要**在客户端再维护多份注册表再与结构合并；切片与拼表由服务端完成。本地开发将场景三件套放在 `data/server/scenes/<id>/`，由 `src/preview/previewDevServer` 与开发者面板加载，仅用于预览，不替代线上契约。
