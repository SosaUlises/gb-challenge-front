import type {
  ChooseOptionRequest,
  DecisionResult,
  GameSession,
  RankingEntry,
  StartGameRequest,
} from '../types/game'

const API_URL =
  import.meta.env.VITE_API_URL ?? 'https://gb-challenge-api.onrender.com/api'

export async function startGame(request: StartGameRequest): Promise<GameSession> {
  const response = await fetch(`${API_URL}/game/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('No se pudo iniciar la partida')
  }

  return response.json()
}

export async function getGame(gameSessionId: string): Promise<GameSession> {
  const response = await fetch(`${API_URL}/game/${gameSessionId}`)

  if (!response.ok) {
    throw new Error('No se pudo obtener la partida')
  }

  return response.json()
}

export async function chooseOption(
  request: ChooseOptionRequest
): Promise<DecisionResult> {
  const response = await fetch(`${API_URL}/game/choose-option`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('No se pudo elegir la opción')
  }

  return response.json()
}

export async function getRanking(): Promise<RankingEntry[]> {
  const response = await fetch(`${API_URL}/ranking`)

  if (!response.ok) {
    throw new Error('No se pudo obtener el ranking')
  }

  const data = await response.json()

  if (Array.isArray(data)) return data
  if (Array.isArray(data.items)) return data.items
  if (Array.isArray(data.ranking)) return data.ranking

  return []
}
