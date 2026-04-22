# WebStructureRenderer

在浏览器中预览 Minecraft 结构/场景数据的前端项目，使用 **Vue 3**、**Vite** 与 **Three.js** 进行三维渲染与交互。

## 功能概要

- 解析结构场景文档（含紧凑格式与渲染资源包），在页面中展示与操作。
- 提供可嵌入的库入口（`mount` 等），便于在 wiki 等页面中挂载预览。
- 另含独立 **Workbench** 构建，用于在 SDE JAR 等环境中作为静态工具页面使用（与仅部署嵌入库时产物不同，请勿混用目录）。

## 环境要求

- [Node.js](https://nodejs.org/)（建议当前 LTS）

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 本地开发（Vite 开发服务器） |
| `npm run build` | 类型检查并完整构建（库 + Workbench） |
| `npm run build:lib` | 仅构建可嵌入的库（`dist/`） |
| `npm run build:workbench` | 仅构建 Workbench（`dist-workbench/`） |
| `npm run preview` | 本地预览生产构建结果 |

## 说明

- 仅需要对外嵌入、对接 wiki 等场景时，使用 **`npm run build:lib`** 即可，按项目约定部署 `dist/` 产物。
- 与 **StructureDataExporter / SDE** 相关的完整工作台请使用 `build:workbench` 或 `build:all` 的 Workbench 输出。
