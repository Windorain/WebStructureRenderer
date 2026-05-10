#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')
const distRoot = path.resolve(repoRoot, 'dist-workbench-huiji')
const bundleDir = path.resolve(distRoot, 'bundled')
const outDir = path.resolve(repoRoot, 'dist-huiji')

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function sanitizeWikiText(text) {
  return String(text).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, (ch) => {
    const code = ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')
    return `\\x${code}`
  })
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, sanitizeWikiText(text), 'utf8')
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing build artifact: ${path.relative(repoRoot, filePath)}`)
  }
}

function main() {
  const loaderJsSrc = path.resolve(__dirname, 'Gadget-StructureWorkbench.js')
  const appJsSrc = path.resolve(bundleDir, 'StructureWorkbench.js')
  const cssSrc = path.resolve(bundleDir, 'StructureWorkbench.css')
  assertExists(loaderJsSrc)
  assertExists(appJsSrc)
  assertExists(cssSrc)

  fs.mkdirSync(outDir, { recursive: true })
  const loaderJsOut = path.resolve(outDir, 'StructureWorkbench.js')
  const appJsOut = path.resolve(outDir, 'StructureWorkbench.bundle.js')
  const cssOut = path.resolve(outDir, 'StructureWorkbench.css')
  const definitionSrc = path.resolve(__dirname, 'StructureWorkbench.definition.json')
  const definitionOut = path.resolve(outDir, 'StructureWorkbench.definition.json')
  writeText(loaderJsOut, readText(loaderJsSrc))
  writeText(appJsOut, readText(appJsSrc))
  writeText(cssOut, readText(cssSrc))
  writeText(definitionOut, readText(definitionSrc))

  const manifest = {
    generatedAt: new Date().toISOString(),
    pages: [
      {
        title: '零件定义:StructureWorkbench',
        source: path.relative(repoRoot, definitionOut),
        summary: '更新结构工作台零件定义',
      },
      {
        title: '零件:StructureWorkbench.js',
        source: path.relative(repoRoot, loaderJsOut),
        summary: '更新结构工作台加载脚本',
      },
      {
        title: '零件:StructureWorkbench.bundle.js',
        source: path.relative(repoRoot, appJsOut),
        summary: '更新结构工作台应用脚本',
      },
      {
        title: '零件:StructureWorkbench.css',
        source: path.relative(repoRoot, cssOut),
        summary: '更新结构工作台样式',
      },
      {
        title: '模板:结构工作台',
        source: path.relative(repoRoot, path.resolve(__dirname, 'Template-StructureWorkbench.mw')),
        summary: '更新结构工作台入口模板',
      },
    ],
  }
  writeText(path.resolve(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Wrote ${path.relative(repoRoot, loaderJsOut)}`)
  console.log(`Wrote ${path.relative(repoRoot, appJsOut)}`)
  console.log(`Wrote ${path.relative(repoRoot, cssOut)}`)
  console.log(`Wrote ${path.relative(repoRoot, definitionOut)}`)
  console.log(`Wrote ${path.relative(repoRoot, path.resolve(outDir, 'manifest.json'))}`)
}

main()
