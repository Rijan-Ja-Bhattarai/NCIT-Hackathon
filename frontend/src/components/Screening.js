import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const dassItems = [
  { number: 1, text: 'I found it hard to wind down.' },
  { number: 2, text: 'I was aware of dryness of my mouth.' },
  { number: 3, text: 'I couldn\'t seem to experience any positive feeling at all.' },
  { number: 4, text: 'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion).' },
  { number: 5, text: 'I found it difficult to work up the initiative to do things.' },
  { number: 6, text: 'I tended to over-react to situations.' },
  { number: 7, text: 'I experienced trembling (e.g. in the hands).' },
  { number: 8, text: 'I felt that I was using a lot of nervous energy.' },
  { number: 9, text: 'I was worried about situations in which I might panic and make a fool of myself.' },
  { number: 10, text: 'I felt that I had nothing to look forward to.' },
  { number: 11, text: 'I found myself getting agitated.' },
  { number: 12, text: 'I found it difficult to relax.' },
  { number: 13, text: 'I felt down-hearted and blue.' },
  { number: 14, text: 'I was intolerant of anything that kept me from getting on with what I was doing.' },
  { number: 15, text: 'I felt I was close to panic.' },
  { number: 16, text: 'I was unable to become enthusiastic about anything.' },
  { number: 17, text: 'I felt I wasn\'t worth much as a person.' },
  { number: 18, text: 'I felt that I was rather touchy.' },
  { number: 19, text: 'I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat).' },
  { number: 20, text: 'I felt scared without any good reason.' },
  { number: 21, text: 'I felt that life was meaningless.' },
];

const subscaleKeys = ['Depression', 'Anxiety', 'Stress'];

const itemGroups = {
  Depression: [3, 5, 10, 13, 16, 17, 21],
  Anxiety: [2, 4, 7, 9, 15, 19, 20],
  Stress: [1, 6, 8, 11, 12, 14, 18],
};

const scoreLabels = [
  { label: 'Normal', max: { Depression: 9, Anxiety: 7, Stress: 14 } },
  { label: 'Mild', max: { Depression: 13, Anxiety: 9, Stress: 18 } },
  { label: 'Moderate', max: { Depression: 20, Anxiety: 14, Stress: 25 } },
  { label: 'Severe', max: { Depression: 27, Anxiety: 19, Stress: 33 } },
  { label: 'Extremely Severe', max: { Depression: Infinity, Anxiety: Infinity, Stress: Infinity } },
];

const choices = [
  { value: 0, label: '0', description: 'Did not apply at all' },
  { value: 1, label: '1', description: 'Some degree / some of the time' },
  { value: 2, label: '2', description: 'Considerable degree / good part of time' },
  { value: 3, label: '3', description: 'Very much / most of the time' },
];

const initialAnswers = () =>
  dassItems.reduce((accumulator, item) => {
    accumulator[item.number] = '';
    return accumulator;
  }, {});

function getSeverityLabel(score, subscale) {
  return scoreLabels.find((entry) => score <= entry.max[subscale])?.label || 'Extremely Severe';
}

function getSeverityTone(label) {
  switch (label) {
    case 'Normal':
      return 'tone-normal';
    case 'Mild':
      return 'tone-mild';
    case 'Moderate':
      return 'tone-moderate';
    case 'Severe':
      return 'tone-severe';
    default:
      return 'tone-extreme';
  }
}

export default function Screening() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const allAnswered = useMemo(
    () => dassItems.every((item) => answers[item.number] !== ''),
    [answers],
  );

  const handleChange = (number, value) => {
    setAnswers((current) => ({
      ...current,
      [number]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!allAnswered) {
      setError('Please answer all 21 items before submitting the screening.');
      return;
    }

    const nextResults = subscaleKeys.map((subscale) => {
      const rawScore = itemGroups[subscale].reduce(
        (total, itemNumber) => total + Number(answers[itemNumber]),
        0,
      );
      const finalScore = rawScore * 2;
      const severity = getSeverityLabel(finalScore, subscale);

      return {
        subscale,
        score: finalScore,
        severity,
      };
    });

    setResults(nextResults);
    setError('');
  };

  const handleReset = () => {
    setAnswers(initialAnswers());
    setResults(null);
    setError('');
  };

  return (
    <div className="screening-page">
      <div className="screening-page__header card">
        <div>
          <p className="eyebrow">Mental health screening</p>
          <h1 id="screening-title">DASS-21 questionnaire</h1>
          <p className="small">Self-screening only. Not a diagnosis.</p>
        </div>
        <Link to="/" className="back-link">Back to home</Link>
      </div>

      <section className="card screening-shell" aria-labelledby="screening-title">
        <form className="screening-form" onSubmit={handleSubmit}>
          <p className="screening-intro small">
            Rate each item from 0 to 3 using the scale below. The questionnaire contains 21 items and scores are only
            shown after every item has been answered and submitted.
          </p>

          <div className="rating-legend" aria-label="Response scale">
            {choices.map((choice) => (
              <div key={choice.value} className="legend-pill">
                <strong>{choice.label}</strong>
                <span>{choice.description}</span>
              </div>
            ))}
          </div>

          <div className="question-list" role="group" aria-label="DASS-21 questions">
            {dassItems.map((item) => (
              <fieldset key={item.number} className="question-card">
                <legend>
                  <span className="question-number">{item.number}</span>
                  <span className="question-text">{item.text}</span>
                </legend>
                <div className="choices" role="radiogroup" aria-label={`Question ${item.number} response options`}>
                  {choices.map((choice) => (
                    <label key={choice.value} className="choice-option">
                      <input
                        type="radio"
                        name={`dass-${item.number}`}
                        value={choice.value}
                        checked={answers[item.number] === String(choice.value)}
                        onChange={() => handleChange(item.number, String(choice.value))}
                      />
                      <span>{choice.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="screening-actions">
            <button type="submit" className="btn primary">Submit screening</button>
            <button type="button" className="btn secondary" onClick={handleReset}>Reset</button>
          </div>

          {error ? <p className="status error" role="alert">{error}</p> : null}

          <div className="disclaimer">
            <strong>Important:</strong> This is not a diagnosis. If your scores concern you, or if you feel unsafe,
            seek help from a licensed professional or local emergency services.
          </div>

          {results ? (
            <div className="results-panel" aria-live="polite">
              <h3>Your results</h3>
              <div className="results-grid">
                {results.map((result) => (
                  <div key={result.subscale} className={`result-card ${getSeverityTone(result.severity)}`}>
                    <span className="result-label">{result.subscale}</span>
                    <strong>{result.score}</strong>
                    <span>{result.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </form>
      </section>
    </div>
  );
}