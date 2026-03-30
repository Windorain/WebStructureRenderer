/**
 * 逻辑纹理 id → 构建时可解析的 URL（与 GT5U `src/main/resources` 路径对齐）
 */
import texWhite from '../../data/resources/assets/_stub/tex_white.png?url'
import texPotin from '../../data/resources/assets/miscutils/textures/blocks/TileEntities/MACHINE_CASING_STABLE_Potin.png?url'
import texTinPipe from '../../data/resources/assets/gregtech/textures/blocks/iconsets/MACHINE_CASING_ITEM_PIPE_TIN.png?url'
import texBrassPipe from '../../data/resources/assets/gregtech/textures/blocks/iconsets/MACHINE_CASING_ITEM_PIPE_BRASS.png?url'
import texController from '../../data/resources/assets/miscutils/textures/blocks/iconsets/controllerFaces/industrialElectrolyzer.png?url'

export const TEXTURE_URL_BY_ID: Record<string, string> = {
  tex_white: texWhite,
  tex_potin: texPotin,
  tex_tin_pipe: texTinPipe,
  tex_brass_pipe: texBrassPipe,
  tex_controller: texController,
}
