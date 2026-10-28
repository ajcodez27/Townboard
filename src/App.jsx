import { Component } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { CITIES } from './data.js';
import Home from './pages/Home.jsx';
import City from './pages/City.jsx';
import Auth from './pages/Auth.jsx';
import Doc from './pages/Doc.jsx';

class Guard extends Component {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true } }

  componentDidCatch(e) { console.error(e) }
  componentDidUpdate(p) { if (p.k !== this.props.k && this.state.err) this.setState({ err: false }) }

  render() {
    return this.state.err ? <div className="page"><main className="doc"><h1>Something went wrong</h1><p className="sub">Please try again.</p><div className="links"><a href="/">Back to home</a></div></main></div> : this.props.children
  }
}

const CityRoute = () => {
  const { slug } = useParams();
  return CITIES[slug] ? <City key={slug} slug={slug} /> : <Navigate to="/" replace />
};

export default function App() {
  const { pathname } = useLocation();
  
  // Safe block-body syntax prevents accidental implicit promise/cleanup returns
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Guard k={pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city/:slug" element={<CityRoute />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/guidelines" element={<Doc kind="guidelines" />} />
        <Route path="/privacy" element={<Doc kind="privacy" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Guard>
  )
}
