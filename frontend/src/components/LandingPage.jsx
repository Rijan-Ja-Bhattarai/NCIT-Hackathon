import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCharacters } from '../api.js'
import { CHARACTER_ART } from '../characterArt.js'
import { useAuth } from '../context/AuthContext.jsx'
import siteConfig from '../data/siteConfig.json'

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



function CompanionCard({ character, ctaTo }) {
  const art = resolveCharacterArt(character)
  const initial = (character.name?.[0] || character.id[0] || '?').toUpperCase()

  return (
    <Link className="companion-card" to={ctaTo}>
      <div
        className={`companion-card__banner${art.image ? '' : ' companion-card__banner--flat'}`}
        style={art.image ? { backgroundImage: `url('${art.image}')` } : undefined}
      />
      <div className="companion-card__body">
        <div className="companion-card__avatar">
          {art.avatar ? <img src={art.avatar} alt="" /> : initial}
        </div>
        <p className="companion-card__name">{character.name}</p>
        <p className="companion-card__tagline">{art.tagline || 'Tap to start a conversation'}</p>
      </div>
    </Link>
  )
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const [topCompanions, setTopCompanions] = useState([])
  const ctaPath = isAuthenticated ? '/characters' : '/login'

  useEffect(() => {
    fetchCharacters()
      .then((list) => {
        const byId = Object.fromEntries(list.map((c) => [c.id, c]))
        const featured = siteConfig.topCompanionIds
          .map((id) => byId[id])
          .filter(Boolean)
        setTopCompanions(featured.length > 0 ? featured : list.slice(0, 3))
      })
      .catch(() => {
        const fallback = siteConfig.topCompanionIds.map((id) => ({
          id,
          name: id,
          ...CHARACTER_ART[id],
        }))
        setTopCompanions(fallback)
      })
  }, [])

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <span className="landing-nav__brand">dAy_2</span>
        <div className="landing-nav__actions">
          {isAuthenticated ? (
            <Link className="btn-pill" to="/characters">
              Open app
            </Link>
          ) : (
            <>
              <Link className="landing-nav__link" to="/login">
                Sign in
              </Link>
              <Link className="btn-pill" to="/login">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="landing-top-banner" role="img" aria-label="Comforting scene: journaling with warm tea">
        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1400&q=80" alt="Person journaling by a window with a warm cup of tea" />
      </div>

      <main className="landing-hero">
        <p className="eyebrow">a quiet place to talk</p>
        <h1 className="landing-hero__title">
          Come hang out
          <br />
          with your companion.
        </h1>
        <p className="landing-hero__subtitle">
          dEMO pairs you with AI characters for open-ended chats — playful, reflective, or
          just someone to listen. Pick who you want to talk to and say hello.
        </p>
        <div className="landing-hero__cta">
          <Link className="btn-pill btn-pill--accent" to={ctaPath}>
            {isAuthenticated ? 'Choose a character' : 'Get started'}
          </Link>
          {!isAuthenticated && (
            <Link className="landing-hero__secondary" to="/login">
              Already have an account? Sign in
            </Link>
          )}
        </div>
      </main>

      <section className="landing-privacy" aria-label="Privacy and anonymity">
        <div className="landing-privacy__inner">
          <p className="landing-privacy__eyebrow">Your privacy matters</p>
          <h2 className="landing-privacy__title">
            <strong>100% anonymous.</strong> No emails. No tracking. Just you and your companion.
          </h2>
          <p className="landing-privacy__text">
            We never ask for your email address or real name. Sign in with any username you like —
            your conversations stay on your device and your identity stays yours.
          </p>
        </div>
      </section>

      <section className="landing-learn" aria-label="Learning with companions">
        <div className="landing-learn__inner">
          <h2 className="landing-learn__title">Learn real subjects, with minimal errors</h2>
          <p className="landing-learn__text">
            Students use dEMO companions to study maths, science, languages, and more. Our models
            are tuned for clear explanations and accurate answers — so you can revise, ask follow-up
            questions, and actually understand the material, not just memorize it.
          </p>
        </div>
      </section>

      {topCompanions.length > 0 && (
        <section className="landing-companions" aria-label="Top companions">
          <div className="landing-companions__header">
            <p className="eyebrow">fan favourites</p>
            <h2 className="landing-companions__title">Meet our top companions</h2>
          </div>
          <div className="landing-companions__grid">
            {topCompanions.map((character) => (
              <CompanionCard key={character.id} character={character} ctaTo={ctaPath} />
            ))}
          </div>
        </section>
      )}

      <section className="landing-feedback" aria-label="User feedback">
        <div className="landing-feedback__header">
          <p className="eyebrow">what people say</p>
          <h2 className="landing-feedback__title">Real feedback from real users</h2>
        </div>
        <div className="landing-feedback__grid">
          {siteConfig.feedback.map((item) => (
            <blockquote key={item.quote} className="landing-feedback__card">
              <p className="landing-feedback__quote">"{item.quote}"</p>
              <footer className="landing-feedback__author">— {item.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>dEMO — Hackathon demo</p>
      </footer>
    </div>
  )
}
