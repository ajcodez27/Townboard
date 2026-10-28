import { Link } from 'react-router-dom';
import { DOCS } from '../data.js';
import { Layout } from '../components.jsx';
import { sorted, lab } from '../utils.jsx';

export default function Doc({ kind }) {
  const [t, s] = DOCS[kind];

  return (
    <Layout title={t}>
      <main className="doc">
        <p className="eyebrow">My Town Board</p>
        <h1>{t}</h1>
        <p className="sub">Last updated November 2026.</p>

        {s.map(([h, p]) => (
          <section key={h}>
            <h2>{h}</h2>
            <p>{p}</p>
          </section>
        ))}

        <div className="links">
          <Link to="/">Back to home</Link>
          {sorted.map(([k]) => (
            <Link key={k} to={'/city/' + k}>
              {lab(k)}
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}