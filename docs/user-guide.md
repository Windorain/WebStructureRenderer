# 工作台使用指南

## 概述

Web Structure Renderer 工作台是一个 Blender 风格的 3D 结构编辑器，用于预览和编辑 Minecraft 建筑结构数据。配合 SDE (StructureDataExporter) 使用，支持完整的数据编辑、预览和导出流程。

## 加载场景

### 从本地文件打开

1. 点击菜单栏 **文件 → 打开场景**
2. 选择 `.json` 格式的场景数据文件
3. 或直接将 `.json` 文件拖入工作台窗口

支持格式：
- **Raw JSON** — 完整明文场景数据
- **Compact 信封** — gzip + Base64 压缩格式（自动解压）

### 从 SDE 加载

1. 点击工具栏设置图标，打开数据源设置
2. 选择 **SDE** 模式
3. 填写 API 基址（如 `http://127.0.0.1:37564`）和 Token
4. 点击测试连接
5. 从导出列表中选择场景加载

### 加载内置示例

1. 在设置中选择 **内置示例** 模式
2. 从下拉列表中选择一个示例场景

## 编辑场景

### 场景元数据

在右侧属性面板中选择 **场景信息**，可编辑以下字段：

| 字段 | 说明 |
|------|------|
| label | 场景显示名称 |
| id | 场景唯一标识 |
| author | 作者 |
| gtnhVersion | GTNH 版本号 |
| structureId | 结构注册名 |

修改后 300ms 自动应用到预览。

### 方块注解 (Tooltip)

1. 在 3D 视口中点击选取方块
2. 在属性面板中选择 **注解编辑**
3. 输入文本内容，支持 Markdown 和 Minecraft 颜色码（如 `§a` 绿色）
4. 点击保存

## 3D 视口操作

| 操作 | 方式 |
|------|------|
| 旋转视角 | 鼠标拖拽 |
| 缩放 | 滚轮 |
| 平移 | 中键拖拽 |
| 选取方块 | 点击方块 |
| 切换投影 | 视口内切换按钮 |

### 分层预览

底栏选择 **分层预览** 标签，拖动滑块可按 Y 层查看结构。

### 帧控制（World 文档）

对于包含多帧的 World 文档，底栏选择 **帧控制** 标签，可播放帧动画或手动切换帧。

## 预览与导出

### Wiki 查看器

切换到 **Wiki 查看器** 标签，可在模拟 Wiki 页面的环境中预览结构。右侧面板可调整：

- 功能组件开关（标题栏、统计栏、帧控制等）
- 视口尺寸
- 投影模式（正交 / 透视）
- 场景背景色
- 图标渲染参数

### 导出

切换到 **导出** 标签，支持以下格式：

| 格式 | 说明 |
|------|------|
| Raw JSON | 完整明文 JSON，可再次编辑 |
| Compact JSON | gzip + Base64 压缩信封，体积更小 |
| OBJ (方块) | 每个方块独立 mesh 的 Wavefront .obj |
| OBJ (连通) | 合并共面方块以减少面数 |
| 等轴 PNG | 4 个方向的等轴视角渲染图 |
| 剪贴板 | 复制 Raw JSON 到系统剪贴板 |

## SDE 使用指南

SDE (StructureDataExporter) 是 Minecraft 1.7.10 Forge 模组，专为 GTNH 整合包设计。它将游戏中方块的多边形烘焙数据（顶点、UV、亮度、颜色）导出为结构化 JSON 文件，供工作台渲染。

### 安装

1. 将 SDE 模组 `.jar` 放入 Minecraft 客户端的 `mods/` 目录
2. 启动游戏。SDE 会自动加载，无需额外配置
3. 需要有 OP 权限才能使用所有命令

### 典型工作流

导出结构的完整流程分为四步：

```
选择区域 → 记录数据 → 导出烘焙 → Web 查看
```

**第一步：开始会话**

在游戏聊天框中输入：
```
/sde start
```

**第二步：选择区域**

用以下方法之一划定需要导出的矩形范围：

- 走到角落 1 位置，输入 `/sde pos1`
- 走到对角角落 2 位置，输入 `/sde pos2`

或者用准星瞄准方块：`/sde hpos1` / `/sde hpos2`

也可使用**选取工具**（`sde_tool_select`）：左键点方块设 pos1，右键设 pos2。

选取模式有两种：
- `cuboid`（默认）— 两个对角点定义矩形
- `extend` — 逐点扩展边界（`/sde sel extend`）

**第三步：记录扫描**

```
/sde record
```

将当前选区内的方块数据扫描到当前帧。支持多帧录制：

```
/sde record 10     — 连续录制 10 tick
/sde record cycle  — 录制完整机器周期（循环直到状态与首帧相同）
/sde setframe 3    — 切换到第 3 帧
```

**第四步：导出文件**

```
/sde export         — 导出为 Compact 格式（gzip + Base64，体积小）
/sde export raw     — 导出为 Raw 格式（明文 JSON，可编辑）
```

导出过程分为两阶段：
1. **服务端**扫描方块类型、元数据、NBT → 写出中间 JSON
2. **客户端**用 Minecraft 原版曲面细分器烘焙几何 → 写出最终文件到 `structure_exports/`

**第五步：Web 查看**

```
/sde web            — 启动内置 Web 服务器（默认端口 37564）
```

点击聊天栏中的可点击链接，浏览器将打开工作台。将 Token 填入工作台设置即可加载导出文件。

### 命令速查

所有命令均以 `/sde` 开头，需要 OP 权限（权限等级 2）。

**会话管理**

| 命令 | 说明 |
|------|------|
| `/sde start` | 开始导出会话 |
| `/sde end` | 结束导出会话 |
| `/sde status` | 查看当前会话状态（选区坐标、帧列表等） |

**选区操作**

| 命令 | 说明 |
|------|------|
| `/sde pos1` | 脚下方块设为角落 1 |
| `/sde pos2` | 脚下方块设为角落 2 |
| `/sde hpos1` | 准星瞄准的方块设为角落 1 |
| `/sde hpos2` | 准星瞄准的方块设为角落 2 |
| `/sde sel` | 查看当前选取模式 |
| `/sde sel cuboid` | 对角矩形模式 |
| `/sde sel extend` | 逐点扩展模式 |

**记录与导出**

| 命令 | 说明 |
|------|------|
| `/sde record` | 扫描选区，写入当前帧 |
| `/sde record <N>` | 连续 N tick 录制（最大 256） |
| `/sde record cycle` | 循环录制（检测状态回到首帧时停止） |
| `/sde setframe <N>` | 切换活动帧编号 |
| `/sde setname <name>` | 设置输出文件名（默认 `export`） |
| `/sde setstructureid <id>` | 设置结构标识符 |
| `/sde export` | 导出 Compact 格式 |
| `/sde export raw` | 导出 Raw 明文格式 |

**Web 服务器**

| 命令 | 说明 |
|------|------|
| `/sde web [port]` | 启动 Web 服务器（默认 37564，端口占用自动 +1） |
| `/sde webstop` | 停止 Web 服务器 |

**注册表导出**

| 命令 | 说明 |
|------|------|
| `/sde dump` | 导出方块/材质/模型注册表到 `structure_exports/` |

### 专用工具

SDE 提供三种手持工具，需要 OP 权限：

| 物品 | 操作 | 功能 |
|------|------|------|
| 选取工具 (`sde_tool_select`) | 左键 / 右键 | 与 `/sde pos1` / `/sde pos2` 等效 |
| 录制工具 (`sde_tool_record`) | 右键 | 与 `/sde record` 等效 |
| 注解工具 (`sde_tool_noter`) | Shift + 右键 | 为方块添加注解文本（Tooltip） |

### 自动化模式

SDE 支持无人值守的全自动导出，适用于 CI/CD 或批量处理。

配置文件（Forge 标准位置）中的 `automation` 类别：

| 配置项 | 默认值 | 说明 |
|------|------|------|
| `autoLoadFirstSingleplayerWorld` | `false` | 自动加载第一个单人世界 |
| `automationCommandFile` | `sde_automation_commands.txt` | 自动化命令文件路径 |
| `commandDelayTicks` | `20` | 命令间延迟（tick） |
| `exitGameAfterCommands` | `true` | 命令执行完毕后关闭游戏 |
| `cleanupCommandFileAfterRun` | `true` | 执行后删除命令文件 |

命令文件格式：每行一条聊天命令（`#` 开头为注释，空行忽略）。示例：

```
# 全自动导出脚本
/sde start
/sde pos1
# (使用工具或提前设置好坐标)
/sde record
/sde export raw
/sde web
```

### REST API

嵌入式 Web 服务器提供以下 API 端点：

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/ping` | 健康检查，返回 `{"ok": true}` |
| `GET` | `/api/v1/exports` | 列出所有导出文件 |
| `GET` | `/api/v1/exports/<name>` | 读取指定导出文件 |
| `GET` | `/api/v1/workspace/document` | 读取工作区文档 |
| `PUT` | `/api/v1/workspace/document` | 覆盖工作区文档 |
| `PATCH` | `/api/v1/workspace/document` | 合并更新工作区文档 |

认证方式：HTTP Header `Authorization: Bearer <token>` 或 URL 参数 `?token=<token>`。

### 输出文件

所有导出文件位于 Minecraft 目录下的 `structure_exports/` 文件夹：

| 文件 | 说明 |
|------|------|
| `<name>.json` | 最终烘焙结构文件（含 blockPalette、materialPalette、cellGrid、textureBlobs） |
| `_sde_workspace.json` | 工作台状态文件 |
| `block_registry.json` | 全部方块注册表（`/sde dump` 生成） |
| `material_registry.json` | 全部材质注册表 |
| `model_registry.json` | 模型注册表骨架 |

## 快捷键与技巧

- 工作区切换不销毁 3D 上下文（`v-show` 保持 WebGL 存活）
- 文件保存支持 File System Access API（浏览器需在安全上下文中）
- 布局面板可拖拽调整右侧面板宽度
- 修改后状态栏提示 "未保存"，保存后清除
- 语言切换：编辑 → 中文/English
