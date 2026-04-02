/**
 * 等待 wiki-mock 写入仓库根目录 .wmr-preview-port（供 Vite 读代理端口）。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..', '..')
const PORT_FILE = path.join(REPO_ROOT, '.wmr-preview-port')
const TIMEOUT_MS = Number(process.env.WAIT_PREVIEW_PORT_MS || 30000)
const INTERVAL_MS = 100

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  const start = Date.now()
  while (!fs.existsSync(PORT_FILE)) {
    if (Date.now() - start > TIMEOUT_MS) {
      console.error(`[wait-preview-port] 超时 (${TIMEOUT_MS}ms)，未找到: ${PORT_FILE}`)
      process.exit(1)
    }
    await sleep(INTERVAL_MS)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
