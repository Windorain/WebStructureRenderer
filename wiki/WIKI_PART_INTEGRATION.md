# 灰机零件集成：Wiki 渲染包

服务端响应为 **场景 JSON 原文**（`StructureData` 或 **World** 多帧；World 当前需至少一帧含内嵌 `structure`）。客户端用其构造 `RenderBundle`：`{ document: <该 JSON> }`（见 `src/render/schema/types.ts`）。

- **可信源**：仅 `document` 内各帧的 `blockPalette`、`materialPalette`、`cellGrid`。纹理由客户端按 palette（及 World 全帧汇总）预取，**不**使用独立 `block_registry` / `material_registry` / `model_registry`拼表。
- 可选元数据：`bundleId`、`assetsBaseUrl`、`payloadSchemaVersion`

零件侧流程：**请求场景 JSON → 交给 `loadPreviewSession` 或自管预取**：

```ts
import { loadPreviewSession } from '@/preview/previewSession'
import { resolveRenderBundle } from '@/render/data/bundleResolve'

const { renderBundle, materialLibrary } = await loadPreviewSession({ sceneId: 'myScene' })
const { definition, materialKeyPrefix } = resolveRenderBundle(renderBundle)
// buildBlockMesh(definition, materialLibrary, { materialKeyPrefix })
```

`document` 为 World 且需指定帧时：`resolveRenderBundle(bundle, frameIndex)`；**World 加载时会预取全帧所需材质**，切帧不再次拉贴图。

若构建为 IIFE 全局，可使用 `WikiMultiStructureRender.resolveRenderBundle`（见 `src/main.ts`导出）。

本地开发：`GET /preview-api/scenes/:id` 返回 `data/scenes/<id>.json`；palette 侧栏键为 **registryId@meta**（与导出约定一致）。
