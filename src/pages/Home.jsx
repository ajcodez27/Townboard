import {useState,useRef,useEffect} from 'react';import {useNavigate} from 'react-router-dom';import {CITIES} from '../data.js';import {Layout} from '../components.jsx';import {Icon,sorted,lab} from '../utils.jsx';
const OUT='8,12 219,10 198,40 228,62 249,90 274,115 295,145 320,175 354,210 380,250 407,306 396,330 375,360 363,400 358,438 309,474 293,453 71,439 59,410 51,360 51,310 59,265 44,223';
const PT={atlanta:[111,135,'l'],suwanee:[137,105,'r'],savannah:[389,302,'l']};
export default function Home(){const nav=useNavigate(),[q,setQ]=useState(''),[open,setOpen]=useState(false),sw=useRef(),inp=useRef(),go=k=>nav('/city/'+k);
 useEffect(()=>{const h=e=>!sw.current?.contains(e.target)&&setOpen(false);document.addEventListener('click',h);return()=>document.removeEventListener('click',h)},[]);
 const s=q.trim().toLowerCase(),m=sorted.map(([k,c])=>{const hit=c.kw.find(w=>w.toLowerCase().includes(s)),city=lab(k).toLowerCase().includes(s)||c.county.toLowerCase().includes(s);return(!s||city||hit)?[k,c,!city&&s?hit:'']:null}).filter(Boolean);
 const key=e=>{const bs=[...sw.current.querySelectorAll('.res button')],i=bs.indexOf(document.activeElement);
  if(e.key==='ArrowDown'){e.preventDefault();(bs[i+1]||bs[0])?.focus()}else if(e.key==='ArrowUp'){e.preventDefault();i>0?bs[i-1].focus():inp.current.focus()}
  else if(e.key==='Escape'){setOpen(false);inp.current.focus()}else if(e.key==='Enter'&&e.target===inp.current&&bs[0])bs[0].click()};
 return <Layout title="Home"><main className="hero"><section><p className="eyebrow">Local events!</p><h1>Find local<br/>events nearby.</h1>
 <p className="sub">Discover local events, community meetings, and volunteer opportunities happening in your area.</p>
 <label className="lbl" htmlFor="q">Enter your city</label>
 <div className="sw" ref={sw} onKeyDown={key}><div className="search"><Icon n="search" s={18}/><input id="q" ref={inp} autoComplete="off" value={q} placeholder="Search a city or place, e.g. Suwanee or Piedmont Park" onFocus={()=>setOpen(true)} onChange={e=>{setQ(e.target.value);setOpen(true)}}/>
  {q&&<button className="clr" style={{display:'block'}} aria-label="Clear search" onClick={()=>{setQ('');inp.current.focus()}}><Icon n="x"/></button>}</div>
  {open&&<ul className="res">{m.length?m.map(([k,c,h])=><li key={k}><button onClick={()=>go(k)}><Icon n="map-pin" s={18}/><span className="t"><b>{lab(k)}</b><small>{h?`Matched: ${h} · `:''}{c.county} · View local events</small></span><Icon n="arrow-right"/></button></li>):<li className="none">No results for “{q}”. Try Atlanta, Savannah or Suwanee.</li>}</ul>}</div>
 <p className="free">Open to everyone in your community</p></section>
 <section className="map"><div className="mh eyebrow"><span>Georgia</span><span>Select a city</span></div>
 <svg viewBox="-30 0 466 490" role="img" aria-label="Map of Georgia with Atlanta, Savannah and Suwanee"><polygon points={OUT} fill="#cfcdc4" stroke="#a9a69a" strokeWidth="2" strokeLinejoin="round"/>
 {Object.entries(PT).map(([k,[x,y,d]])=>{const t=lab(k),w=t.length*7.8+22,px=d==='l'?x-12-w:x+12;
  return <g key={k} className="pin2" tabIndex="0" role="link" aria-label={t} onClick={()=>go(k)} onKeyDown={e=>e.key==='Enter'&&go(k)}><circle cx={x} cy={y} r="8" fill={CITIES[k].color} stroke="#fff" strokeWidth="3"/><rect className="pl" x={px} y={y-12} width={w} height="24" rx="6" fill="#1a1a18"/><text x={px+11} y={y+5} fill="#fff" style={{font:'600 14px Inter,sans-serif'}}>{t}</text></g>})}</svg></section></main></Layout>}
