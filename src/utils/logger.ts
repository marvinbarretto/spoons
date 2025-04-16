export function logAction(label: string, payload?: unknown) {
  const style =
    'color: #455A64; background: #CFD8DC; padding: 2px 6px; border-radius: 4px; font-weight: bold;'
  console.log(`%c[ACTION] ${label}`, style, payload ?? '')
}

export function logError(label: string, payload?: unknown) {
  console.error(`[ERROR] ${label}`, payload ?? '')
}
