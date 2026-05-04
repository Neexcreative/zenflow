const fs = require('fs')
const path = require('path')

const rootDist = path.join(__dirname, '..', 'dist')
const clientDist = path.join(__dirname, '..', 'Client', 'dist')

if (!fs.existsSync(clientDist)) {
  console.error(`Client build output not found: ${clientDist}`)
  process.exit(1)
}

fs.rmSync(rootDist, { recursive: true, force: true })
fs.cpSync(clientDist, rootDist, { recursive: true })

console.log(`Copied ${clientDist} to ${rootDist}`)
