# 灰机零件集成：Wiki 渲染包

宿主传入 **已打包** 的场景 JSON 原文（`StructureData` 或 **World** 多帧；World 当前需至少一帧含内嵌 `structure`）。须含：

- 根级非空 **`textureBlobs`**：`string[]`，每项为标准 Base64（无 `data:` 前缀）的单张 PNG 字节。
- 每条 **`materialPalette`** 槽位含有效 **`textureBlobIndex`**（指向 `textureBlobs` 下标）。`locator` 可选，仅溯源；**Wiki 不会**用其发起 HTTP。

客户端构造 `RenderBundle`：`{ document: <该 JSON> }`（见 `src/render/schema/types.ts`）。可选元数据：`bundleId`、`payloadSchemaVersion`（**不再**使用 `assetsBaseUrl`）。

**可信源**：`document` 内各帧的 `blockPalette`、`materialPalette`、`cellGrid` 及根级 `textureBlobs`。

零件侧流程：**将打包 JSON 交给 `loadPreviewSessionFromDocument` 或自管解码**：

```ts
import { loadPreviewSessionFromDocument } from '@/preview/previewSession'
import { resolveRenderBundle } from '@/render/data/bundleResolve'

const packedDoc = /* 宿主内联或单次注入的对象 */
const { renderBundle, materialLibrary } = await loadPreviewSessionFromDocument(packedDoc)
const { definition, materialKeyPrefix } = resolveRenderBundle(renderBundle)
// buildBlockMesh(definition, materialLibrary, { materialKeyPrefix })
```

`document` 为 World 且需指定帧时：`resolveRenderBundle(bundle, frameIndex)`。

若构建为 IIFE 全局，可使用 `WikiMultiStructureRender.loadPreviewSessionFromDocument`、`WikiMultiStructureRender.resolveRenderBundle`（见 `src/main.ts` 导出）。

本地开发：`npm run dev`，默认加载 `data/scenes/export.json`；可用 URL 参数 `sceneId=<文件名不含 .json>` 切换 `data/scenes/` 下其它打包文件。
