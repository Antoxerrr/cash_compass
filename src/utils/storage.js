const STORAGE_KEY = 'cash_compass'
const LOG_KEY = 'cash_compass_log'

const DEFAULTS = {
  balance: 0,
  paydays: [],
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getLocalDateKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function loadTodayLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY)
    if (!raw) return []
    const log = JSON.parse(raw)
    if (log.date !== getLocalDateKey()) return []
    return log.entries
  } catch {
    return []
  }
}

export function saveTodayLog(entries) {
  localStorage.setItem(LOG_KEY, JSON.stringify({
    date: getLocalDateKey(),
    entries,
  }))
}
