import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components.jsx';

export default function Auth() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [up, setUp] = useState(sp.get('mode') !== 'signin');
  const [f, setF] = useState({ name: '', email: '', pw: '' });
  const [er, setEr] = useState('');

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const sub = (e) => {
    e.preventDefault();
    if (
      (up && !f.name.trim()) ||
      !/\S+@\S+\.\S+/.test(f.email) ||
      f.pw.length < 6
    ) {
      return setEr(
        'Please enter a valid name, email and a password of 6+ characters.'
      );
    }
    localStorage.setItem(
      'user',
      JSON.stringify({ name: up ? f.name : f.email, email: f.email })
    );
    nav('/');
  };

  return (
    <Layout title="Sign Up">
      <main className="auth">
        <form className="card" onSubmit={sub} noValidate>
          <h1>{up ? 'Create your account' : 'Welcome back'}</h1>
          <p className="sub">
            Post events and save your favorite boards. Browsing is always free.
          </p>

          {up && (
            <label className="fld">
              Name
              <input value={f.name} onChange={set('name')} />
            </label>
          )}

          <label className="fld">
            Email
            <input type="email" value={f.email} onChange={set('email')} />
          </label>

          <label className="fld">
            Password
            <input type="password" value={f.pw} onChange={set('pw')} />
          </label>

          {er && <em>{er}</em>}

          <button className="dark wide">
            {up ? 'Create Account' : 'Sign in'}
          </button>

          <button
            type="button"
            className="guest"
            onClick={() => {
              localStorage.setItem('guest', 'true');
              nav('/');
            }}
          >
            Continue as Guest
          </button>

          <p className="free">
            {up ? 'Have an account? ' : 'New here? '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setUp(!up);
                setEr('');
              }}
            >
              {up ? 'Sign in' : 'Create account'}
            </a>
          </p>
        </form>
      </main>
    </Layout>
  );
}