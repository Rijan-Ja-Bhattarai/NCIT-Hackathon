// api.js — thin wrapper around the Flask endpoints defined in main.py.
// Kept deliberately dumb: no caching, no retries. Errors are thrown as-is
// so callers can decide how to present them.

async function asJson(res) {
  let body = null
  try {
    body = await res.json()
  } catch {
    // non-JSON error body, fall through with body=null
  }
  if (!res.ok) {
    const message = body?.error || `Request failed (${res.status})`
    throw new Error(message)
  }
  return body
}

export async function fetchCharacters() {
  const res = await fetch('/api/characters')
  const data = await asJson(res)
  return data.characters || []
}

export async function sendChatMessage(characterId, message) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ characterId, message }),
  })
  return asJson(res) // { reply, sentiment: { label, scores } }
}
