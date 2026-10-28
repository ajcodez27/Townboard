import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES, CATS, EV, POSTED } from '../data.js';
import { Layout, Modal, Toast, Note } from '../components.jsx';
import { Icon, ls, getUid, iso, sorted, lab } from '../utils.jsx';

const key = (k) => 'events:' + k;
const save = (k, a) => localStorage.setItem(key(k), JSON.stringify(a));

const M = {
  title: 'Enter an event name',
  cat: 'Select a category',
  date: 'Choose a date',
  time: 'Choose a start time',
  city: 'Select a city',
  place: 'Enter the venue or address',
  body: 'Add a description',
  org: 'Enter the organizer',
};

function EventForm({ init, onSave, onClose }) {
  const edit = !!init;
  const [f, setF] = useState({
    title: '',
    cat: '',
    date: '',
    time: '',
    end: '',
    city: '',
    place: '',
    body: '',
    org: '',
    ...init,
  });
  const [er, setEr] = useState({});

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const v = (k) => (f[k] || '').trim();

  const submit = (e) => {
    e.preventDefault();
    const x = {};
    Object.keys(M).forEach((k) => {
      if (!v(k)) x[k] = M[k];
    });

    if (v('date') && !edit && v('date') < iso(0)) {
      x.date = 'Choose today or a future date';
    }
    if (v('end') && v('time') && v('end') <= v('time')) {
      x.end = 'End time must be after start time';
    }

    setEr(x);
    if (Object.keys(x).length) return;

    onSave(
      {
        cat: v('cat'),
        title: v('title'),
        date: v('date'),
        time: v('time'),
        end: v('end'),
        city: v('city'),
        place: v('place'),
        body: v('body'),
        org: v('org'),
      },
      init
    );
  };

  const F = (k, l, el) => (
    <label className="fld">
      {l}
      {el}
      {er[k] && <em>{er[k]}</em>}
    </label>
  );

  const inp = (k, t = 'text', x = {}) => (
    <input type={t} value={f[k]} onChange={set(k)} {...x} />
  );

  return (
    <Modal onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        <h2>{edit ? 'Edit event' : 'Create new event'}</h2>

        {F('title', 'Event name', inp('title'))}
        {F(
          'cat',
          'Category',
          <select value={f.cat} onChange={set('cat')}>
            <option value="">Select a category</option>
            {Object.keys(CATS).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        )}

        <div className="two">
          {F('date', 'Date', inp('date', 'date', edit ? {} : { min: iso(0) }))}
          {F('time', 'Start time', inp('time', 'time'))}
        </div>

        {F('end', 'End time (optional)', inp('end', 'time'))}
        {F(
          'city',
          'City',
          <select value={f.city} onChange={set('city')}>
            <option value="">Select a city</option>
            {sorted.map(([k]) => (
              <option key={k} value={k}>
                {lab(k)}
              </option>
            ))}
          </select>
        )}

        {F(
          'place',
          'Venue or address',
          inp('place', 'text', { placeholder: 'e.g. Town Center Park' })
        )}
        {F('body', 'Description', <textarea rows="3" value={f.body} onChange={set('body')} />)}
        {F('org', 'Organizer', inp('org'))}

        <div className="acts">
          <button type="button" className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="dark">
            {edit ? 'Save Changes' : 'Post Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function City({ slug }) {
  const c = CITIES[slug],
    nav = useNavigate(),
    uid = getUid();

  const [mine, setMine] = useState(() => ls(key(slug), []));
  const [cat, setCat] = useState('All Categories');
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const [toast, setToast] = useState(null);

  const seed = useMemo(
    () =>
      EV[slug].map((e, i) => ({
        id: `s-${slug}-${i}`,
        cat: e[0],
        title: e[1],
        date: iso(e[2]),
        time: e[3],
        place: e[4],
        org: e[5],
        body: e[6],
        posted: Date.now() - POSTED[i] * 6e4,
        seed: 1,
      })),
    [slug]
  );

  const own = (n) => !n.seed && (!n.owner || n.owner === uid);
  const reload = () => setMine(ls(key(slug), []));

  const list = [...mine, ...seed]
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .filter((n) => cat === 'All Categories' || n.cat === cat);

  const flash = (m, t, ic, ms) => {
    setToast({ m, t, ic });
    ms && setTimeout(() => setToast(null), ms);
  };

  const submit = (d, n) => {
    setForm(null);
    const after = () =>
      d.city !== slug && setTimeout(() => nav('/city/' + d.city), 1400);

    if (n) {
      const old = n.city || slug;
      if (old === d.city) {
        save(
          old,
          ls(key(old), []).map((x) => (x.id === n.id ? { ...x, ...d } : x))
        );
      } else {
        save(
          old,
          ls(key(old), []).filter((x) => x.id !== n.id)
        );
        save(d.city, [{ ...n, ...d }, ...ls(key(d.city), [])]);
      }
      reload();
      flash(
        d.city === slug
          ? 'Changes saved.'
          : `Event moved to ${lab(d.city)}.`,
        'ok',
        'check-circle',
        3000
      );
      after();
    } else {
      flash('Your event is pending review…', 'pending', 'clock');
      setTimeout(() => {
        save(d.city, [
          { id: 'u' + Date.now(), owner: uid, posted: Date.now(), ...d },
          ...ls(key(d.city), []),
        ]);
        reload();
        flash(
          d.city === slug
            ? 'Your event was approved and published.'
            : `Approved and published to ${lab(d.city)}.`,
          'ok',
          'check-circle',
          3000
        );
        after();
      }, 2500);
    }
  };

  const remove = () => {
    save(
      slug,
      ls(key(slug), []).filter((x) => x.id !== del.id)
    );
    reload();
    setDel(null);
  };

  return (
    <Layout title={c.name} city={slug} onPost={() => setForm({})}>
      <main className="board-pg">
        <div className="bh">
          <div>
            <h1>The {c.name} board.</h1>
            <p className="sub">Local plans</p>
          </div>
          <p className="pinned">
            {list.length} event{list.length === 1 ? '' : 's'}{' '}
            {cat === 'All Categories' ? '' : `in ${cat} `}around {c.name}
          </p>
        </div>

        <p className="filter-hint">Swipe or scroll for more categories <span aria-hidden="true">→</span></p>
        <div className="chips" role="group" aria-label="Filter by category">
          {['All Categories', ...Object.keys(CATS)].map((k) => (
            <button
              key={k}
              className={'chip' + (k === cat ? ' on' : '')}
              style={{ '--c': CATS[k] || '#fff' }}
              aria-pressed={k === cat}
              onClick={() => setCat(k)}
            >
              {CATS[k] && <i className="dot" />}
              {k}
            </button>
          ))}
        </div>

        <div className="cork">
          {list.length ? (
            list.map((n) => (
              <Note
                key={n.id}
                n={n}
                own={own(n)}
                onOpen={() => setSel(n)}
                onEdit={() => setForm({ ...n, city: n.city || slug })}
                onRemove={() => setDel(n)}
              />
            ))
          ) : (
            <p className="empty">
              No {cat === 'All Categories' ? '' : cat + ' '}events yet in{' '}
              {lab(slug)}. Be the first to post one.
            </p>
          )}
        </div>
      </main>

      {sel && (
        <Modal cls="nm" onClose={() => setSel(null)}>
          <Note n={sel} full own={own(sel)} city={lab(sel.city || slug)} />
        </Modal>
      )}

      {form && (
        <EventForm
          init={form.id ? form : null}
          onSave={submit}
          onClose={() => setForm(null)}
        />
      )}

      {del && (
        <Modal cls="sm2" onClose={() => setDel(null)}>
          <h2>Remove this event?</h2>
          <p className="sub" style={{ margin: '0 0 20px', fontSize: 15 }}>
            “{del.title}” will be removed from the {c.name} board.
          </p>
          <div className="acts">
            <button className="ghost" onClick={() => setDel(null)}>
              Cancel
            </button>
            <button className="dark danger" onClick={remove}>
              Remove event
            </button>
          </div>
        </Modal>
      )}

      <Toast t={toast} />
    </Layout>
  );
}