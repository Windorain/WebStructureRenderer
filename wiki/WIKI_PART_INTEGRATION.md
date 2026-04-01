# 灰机零件集成：最小完备集

服务端一次响应提供 `MinimalCompletePayload` 形状（见 `src/render/types.ts`）：

- `structure`：`StructureData`（与导出 `export.json` 同形）
- `blockRegistry`：本次渲染所需的 `block_registry` 切片
- `materialRegistry`：本次渲染所需的 `material_registry` 切片
- 可选：`bundleId`、`assetsBaseUrl`、`payloadSchemaVersion`

零件侧流程：**请求接口 → 将 JSON 交给渲染库**：

```ts
import {
  resolveFromMinimalCompletePayload,
  validateMinimalCompletePayload,
} from '@/render/pipeline'

const payload = await fetch('/api/...').then((r) => r.json())
validateMinimalCompletePayload(payload)
const { definition, materialRegistry } = resolveFromMinimalCompletePayload(payload)
// definition → 网格；materialRegistry → SimpleMaterialLibrary
```

若构建为 IIFE 全局，可使用 `WikiMultiStructureRender.resolveFromMinimalCompletePayload`（见 `src/main.ts` 导出）。

**不要**在客户端再维护一份「完整全局注册表」再与结构合并；合并与切片由服务端完成。本地预览可在 `AppPreviewConfig` 中显式组装 `minimalComplete`，或仅用 `devGlobalBlockRegistry` 调试底稿。
