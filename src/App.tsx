import { useState } from 'react'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import RankingPage from './pages/RankingPage'
import type { GameSession } from './types/game'

type AppView = 'home' | 'game' | 'ranking'

function App() {
  const [game, setGame] = useState<GameSession | null>(null)
  const [view, setView] = useState<AppView>('home')
  const [showGameIntro, setShowGameIntro] = useState(false)

  function handleGameStarted(newGame: GameSession) {
    setGame(newGame)
    setShowGameIntro(true)
    setView('game')
  }

  function handleRestart() {
    setGame(null)
    setShowGameIntro(false)
    setView('home')
  }

  if (view === 'ranking') {
    return (
      <RankingPage
        hasPreviousResult={Boolean(game)}
        onBack={() => setView(game ? 'game' : 'home')}
        onRestart={handleRestart}
      />
    )
  }

  if (!game || view === 'home') {
    return <HomePage onGameStarted={handleGameStarted} />
  }

  return (
    <GamePage
      initialGame={game}
      showIntro={showGameIntro}
      onIntroClose={() => setShowGameIntro(false)}
      onRestart={handleRestart}
      onViewRanking={() => setView('ranking')}
    />
  )
}

export default App
