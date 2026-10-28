import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components.jsx';

export default function Auth() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const up = sp.get('mode') !== 'signin';
  const [f, setF] = useState({ name: '', email: '', pw: '' });
  const [er, setEr] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setEr({});
    setShowPassword(false);
  }, [up]);

  const set = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    setEr((errors) => ({ ...errors, [k]: '' }));
  };

  const sub = (e) => {
    e.preventDefault();
    const errors = {};
    if (up && !f.name.trim()) errors.name = 'Enter your name.';
    if (!/\S+@\S+\.\S+/.test(f.email)) errors.email = 'Enter a valid email address.';
    if (f.pw.length < 6) errors.pw = 'Use at least 6 characters.';
    setEr(errors);
    if (Object.keys(errors).length) {
      e.currentTarget.elements.namedItem(Object.keys(errors)[0])?.focus();
      return;
    }
    localStorage.setItem(
      'user',
      JSON.stringify({ name: up ? f.name : f.email, email: f.email })
    );
    nav('/');
  };

  return (
    <Layout title={up ? 'Sign Up' : 'Sign In'}>
      <main className="auth">
        <form className="card" onSubmit={sub} noValidate>
          <h1>{up ? 'Create your account' : 'Welcome back'}</h1>
          <p className="sub">
            Browse events and RSVP without an account.
          </p>

          {up && (
            <label className="fld">
              Name
              <input name="name" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={!!er.name} aria-describedby={er.name ? 'name-error' : undefined} />
              {er.name && <em id="name-error" role="alert">{er.name}</em>}
            </label>
          )}

          <label className="fld">
            Email
            <input name="email" type="email" autoComplete="email" value={f.email} onChange={set('email')} aria-invalid={!!er.email} aria-describedby={er.email ? 'email-error' : undefined} />
            {er.email && <em id="email-error" role="alert">{er.email}</em>}
          </label>

          <div className="fld">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input id="password" name="pw" type={showPassword ? 'text' : 'password'} autoComplete={up ? 'new-password' : 'current-password'} value={f.pw} onChange={set('pw')} aria-invalid={!!er.pw} aria-describedby={er.pw ? 'password-error' : undefined} />
              <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls="password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            {er.pw && <em id="password-error" role="alert">{er.pw}</em>}
          </div>

          <button className="dark wide">
            {up ? 'Create account' : 'Sign in'}
          </button>

          <button
            type="button"
            className="guest"
            onClick={() => {
              localStorage.setItem('guest', 'true');
              nav('/');
            }}
          >
            Continue as guest
          </button>

          <p className="free">
            {up ? 'Have an account? ' : 'New here? '}
            <Link to={up ? '/signup?mode=signin' : '/signup'}>
              {up ? 'Sign in' : 'Create account'}
            </Link>
          </p>
        </form>
      </main>
    </Layout>
  );
}
