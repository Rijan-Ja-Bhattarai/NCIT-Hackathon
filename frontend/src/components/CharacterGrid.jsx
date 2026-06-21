import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { CHARACTER_ART } from '../characterArt.js'

function resolveCharacterArt(character) {
  const fallback = CHARACTER_ART[character.id] || {}
  const apiTagline =
    character.tagline && !character.tagline.startsWith('You are') ? character.tagline : null
  return {
    image: character.image || fallback.image,
    avatar: character.avatar || fallback.avatar || character.image || fallback.image,
    tagline: apiTagline || fallback.tagline,
  }
}

function CharacterCard({ character, onSelect }) {
  const art = resolveCharacterArt(character)
  const initial = (character.name?.[0] || character.id[0] || '?').toUpperCase()

  return (
    <button className="char-card" onClick={() => onSelect(character.id)}>
      <div className={`char-card__banner ${art.image ? '' : 'char-card__banner--flat'}`}>
        {art.image ? <img src={art.image} alt={`${character.name} banner`} /> : null}
      </div>
      <div className="char-card__body">
        <div className="char-card__avatar">
          {art.avatar ? (
            <img src={art.avatar} alt="" />
          ) : (
            initial
          )}
        </div>
        <p className="char-card__name">{character.name}</p>
        <p className="char-card__tagline">
          {art.tagline || 'Tap to start a conversation'}
        </p>
        <span className="char-card__cta">Start chat →</span>
      </div>
    </button>
  )
}

function ComingSoonCard() {
  return (
    <div className="char-card char-card--placeholder">
      <div className="char-card__placeholder-inner">
        <div className="char-card__placeholder-avatar">?</div>
        <p className="char-card__placeholder-label">Coming soon…</p>
      </div>
    </div>
  )
}

export default function CharacterGrid({ characters, loading, error, onSelect, onRetry }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="grid-screen">
      <header className="grid-screen__header">
        <div>
          <p className="eyebrow">who do you want to talk to today?</p>
          <h1 className="grid-screen__title">Come hang out with your companion</h1>
        </div>
        <div className="grid-screen__user">
          {user?.username && <span className="grid-screen__username">Hi, {user.username}</span>}
          <button className="btn-pill btn-pill--ghost" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {loading && (
        <div className="grid-screen__status">
          <div className="spinner" aria-hidden="true" />
          <span>Loading characters…</span>
        </div>
      )}

      {error && !loading && (
        <div className="grid-screen__status grid-screen__status--error">
          <p>Couldn't reach the character API: {error}</p>
          <button className="btn-pill" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && characters.length === 0 && (
        <div className="grid-screen__status">
          <p>No characters defined yet. Add some to characters.py.</p>
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <div className="char-grid">
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} onSelect={onSelect} />
          ))}
          <ComingSoonCard />
        </div>
      )}
    </div>
  )
}
