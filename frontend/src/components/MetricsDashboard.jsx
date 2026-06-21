import { useEffect, useState } from 'react'
import { fetchMetrics } from '../api.js'

export default function MetricsDashboard() {
  const [data, setData] = useState({ metrics: [], summary: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchMetrics(200)
      .then((d) => setData(d))
      .catch((e) => setError(e.message || 'Failed to load metrics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (<div className="grid-screen__status">Loading metrics…</div>)
  if (error) return (<div className="grid-screen__status grid-screen__status--error">{error}</div>)

  const { summary, metrics } = data

  return (
    <div className="metrics-page">
      <h2>Sentiment Engine Metrics</h2>
      <div className="metrics-summary">
        <div>Rows: {summary.count ?? 0}</div>
        <div>Avg tokenization (ms): {summary.avg_tokenization_ms?.toFixed(2) ?? '—'}</div>
        <div>Avg inference (ms): {summary.avg_inference_ms?.toFixed(2) ?? '—'}</div>
        <div>Avg total (ms): {summary.avg_total_ms?.toFixed(2) ?? '—'}</div>
        <div>Avg tokens: {summary.avg_token_count?.toFixed(1) ?? '—'}</div>
        <div>Avg model load (ms): {summary.avg_model_load_ms?.toFixed(2) ?? '—'}</div>
      </div>

      <h3>Recent entries (most recent last)</h3>
      <div className="metrics-table-wrap">
        <table className="metrics-table" role="table">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>character_id</th>
              <th>label</th>
              <th>token_count</th>
              <th>tokenization_ms</th>
              <th>inference_ms</th>
              <th>total_ms</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((r, i) => (
              <tr key={i}>
                <td>{r.timestamp}</td>
                <td>{r.character_id}</td>
                <td>{r.label}</td>
                <td>{r.token_count ?? '—'}</td>
                <td>{r.tokenization_ms ?? '—'}</td>
                <td>{r.inference_ms ?? '—'}</td>
                <td>{r.total_ms ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
