export type DecisionOption = {
  id: string
  text: string
}

export type Scenario = {
  id: string
  order: number
  month: number
  quarter: string
  title: string
  description: string
  topic: string
  options: DecisionOption[]
}

export type GameSession = {
  id: string
  playerName: string
  rentability: number
  clients: number
  organizationalClimate: number
  brandImage: number
  operationalEfficiency: number
  currentScenarioOrder: number
  isFinished: boolean
  finalScore: number
  finalRating: string
  currentScenario: Scenario | null
}

export type DecisionHistoryEntry = {
  scenarioOrder: number
  scenarioTitle: string
  optionText: string
}

export type StartGameRequest = {
  playerName: string
}

export type ChooseOptionRequest = {
  gameSessionId: string
  optionId: string
}

export type DecisionResult = {
  consequence: string
  gameSession: GameSession
}

export type RankingEntry = {
  id?: string
  playerName?: string
  name?: string
  score?: number
  finalScore?: number
  rating?: string
  finalRating?: string
  createdAt?: string
  date?: string
  playedAt?: string
}
