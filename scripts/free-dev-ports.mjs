#!/usr/bin/env node
/**
 * Frees local dev ports before starting turbo dev.
 * Prevents EADDRINUSE when a previous dev session was left running.
 */

import { execSync } from 'node:child_process'

const DEV_PORTS = [3000, 3001]
const isWindows = process.platform === 'win32'

function pidsOnPort(port) {
  try {
    if (isWindows) {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' })
      const pids = new Set()

      for (const line of out.split('\n')) {
        if (!line.includes('LISTENING')) continue
        const parts = line.trim().split(/\s+/)
        const pid = parts.at(-1)
        if (pid && /^\d+$/.test(pid) && pid !== '0') {
          pids.add(pid)
        }
      }

      return [...pids]
    }

    const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim()
    return out ? out.split('\n').filter(Boolean) : []
  } catch {
    return []
  }
}

function killPid(pid) {
  try {
    if (isWindows) {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' })
      return true
    }

    process.kill(Number(pid), 'SIGTERM')
    return true
  } catch {
    return false
  }
}

function sleep(ms) {
  if (isWindows) {
    execSync('powershell -Command "Start-Sleep -Milliseconds ' + ms + '"', { stdio: 'ignore' })
    return
  }

  execSync(`sleep ${ms / 1000}`)
}

for (const port of DEV_PORTS) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const pids = pidsOnPort(port)
    if (pids.length === 0) break

    for (const pid of pids) {
      if (killPid(pid)) {
        console.log(`[dev] Freed port ${port} (pid ${pid})`)
      }
    }

    if (attempt < 2) {
      sleep(200)
    }
  }
}
