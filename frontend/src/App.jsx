import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import CharacterGrid from './components/CharacterGrid.jsx'
import ChatScreen from './components/ChatScreen.jsx'
import LandingPage from './components/LandingPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { fetchCharacters } from './api.js'
import './app.css'
import MetricsDashboard from './components/MetricsDashboard.jsx'

function CharactersPage() {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCharacters = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchCharacters()
      .then((list) => setCharacters(list))
      .catch((err) => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  return (
    <CharacterGrid
      characters={characters}
      loading={loading}
      error={error}
      onSelect={(id) => navigate(`/chat/${encodeURIComponent(id)}`)}
      onRetry={loadCharacters}
    />
  )
}

function ChatPage() {
  const { characterId } = useParams()
  const navigate = useNavigate()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCharacters()
      .then((list) => setCharacters(list))
      .catch((err) => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid-screen">
        <div className="grid-screen__status">
          <div className="spinner" aria-hidden="true" />
          <span>Loading character…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid-screen">
        <div className="grid-screen__status grid-screen__status--error">
          <p>Couldn't load character: {error}</p>
          <button className="btn-pill" onClick={() => navigate('/characters')}>
            Back to characters
          </button>
        </div>
      </div>
    )
  }

  const character = characters.find((c) => c.id === characterId)

  if (!character) {
    return <Navigate to="/characters" replace />
  }

  return <ChatScreen character={character} onBack={() => navigate('/characters')} />
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/characters"
          element={
            <ProtectedRoute>
              <CharactersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:characterId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/metrics"
          element={
            <ProtectedRoute>
              <MetricsDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
