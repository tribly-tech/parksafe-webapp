#!/usr/bin/env node
/**
 * Frees local dev ports before starting turbo dev.
 * Prevents EADDRINUSE when a previous dev session was left running.
 */

import { execSync } from 'node:child_process'

const DEV_PORTS = [3000, 3001]

function pidsOnPort(port) {
  try {
    const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim()
    return out ? out.split('\n').filter(Boolean) : []
  } catch {
    return []
  }
}

function killPid(pid, signal) {
  try {
    process.kill(Number(pid), signal)
    return true
  } catch {
    return false
  }
}

for (const port of DEV_PORTS) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const pids = pidsOnPort(port)
    if (pids.length === 0) break

    for (const pid of pids) {
      const signal = attempt === 0 ? 'SIGTERM' : 'SIGKILL'
      if (killPid(pid, signal)) {
        console.log(`[dev] Freed port ${port} (pid ${pid}, ${signal})`)
      }
    }

    if (attempt < 2) {
      execSync('sleep 0.2')
    }
  }
}
