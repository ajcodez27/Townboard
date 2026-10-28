import {useEffect,useRef,useState} from 'react';import {Link,useLocation,useNavigate} from 'react-router-dom';
import {CATS} from './data.js';import {Icon,sorted,lab,fD,fT,ago} from './utils.jsx';
function Header({city,onPost}){
 const [open,setOpen]=useState(false),nav=useNavigate(),{pathname,search}=useLocation(),ref=useRef();
 useEffect(()=>{const h=e=>{if(!ref.current?.contains(e.target))setOpen(false)},k=e=>e.key==='Escape'&&setOpen(false);
  document.addEventListener('click',h);document.addEventListener('keydown',k);return()=>{document.removeEventListener('click',h);document.removeEventListener('keydown',k)}},[]);
 const cur=(p,s)=>pathname===p&&(s?search.includes('signin'):!search.includes('signin'))?'page':undefined;
 return <header className="hdr" ref={ref}><Link className="logo" to="/"><svg width="22" height="24" viewBox="0 0 22 24" aria-hidden="true"><rect x="2" y="1" width="18" height="22" rx="3" fill="#1a1a18"/><rect x="6" y="6" width="10" height="2" fill="#f6f3ec"/><rect x="6" y="11" width="7" height="2" fill="#f6f3ec"/></svg>My Town Board</Link>
 <button className="burger" aria-label="Toggle menu" aria-expanded={open} aria-controls="nav" onClick={()=>setOpen(!open)}><Icon n="menu" s={22}/></button>
 <nav id="nav" className={open?'open':''} aria-label="Main" onClick={e=>e.target.closest('a')&&setOpen(false)}>
  {city&&<span className="sel"><select aria-label="City" value={city} onChange={e=>nav('/city/'+e.target.value)}>{sorted.map(([k])=><option key={k} value={k}>{lab(k)}</option>)}</select><Icon n="chevron-down" s={14}/></span>}
  <Link to="/" aria-current={cur('/')}>Home</Link><Link to="/signup" aria-current={cur('/signup')}>Create Account</Link><Link to="/signup?mode=signin" aria-current={cur('/signup',1)}>Sign in</Link>
  {onPost&&<button className="dark" onClick={()=>{setOpen(false);onPost()}}><Icon n="plus"/>Post an event</button>}</nav></header>}
export function Layout({title,city,onPost,children}){
 useEffect(()=>{document.title=title+' - My Town Board'},[title]);
 return <div className="page"><Header city={city} onPost={onPost}/>{children}
 <footer className="ftr"><span>Connecting neighbors with local events.</span><div><Link to="/guidelines">Community guidelines</Link><Link to="/privacy">Privacy</Link><span>© 2026 My Town Board</span></div></footer></div>}
export function Modal({onClose,cls='',children}){
 useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();document.addEventListener('keydown',k);return()=>document.removeEventListener('keydown',k)},[onClose]);
 return <div className="ov" onClick={e=>e.target===e.currentTarget&&onClose()}><div className={'modal '+cls} role="dialog" aria-modal="true"><button className="x" aria-label="Close" onClick={onClose}><Icon n="x" s={18}/></button>{children}</div></div>}
export const Toast=({t})=>t&&<div className={'toast '+t.t} role="status"><Icon n={t.ic} s={18}/>{t.m}</div>;
export function Note({n,full,own,city,onOpen,onEdit,onRemove}){
 const tm=fT(n.time)+(n.end?' – '+fT(n.end):''),stop=f=>e=>{e.stopPropagation();f&&f()};
 return <article className="note" style={{'--c':CATS[n.cat]||CATS.Other}} tabIndex={full?-1:0} onClick={onOpen} onKeyDown={e=>e.key==='Enter'&&e.target===e.currentTarget&&onOpen&&onOpen()}><i className="pin"/>
 <div className="nh"><span className="tagc">{n.cat}</span>{own&&<span className="sm you">Your event</span>}</div><h3>{n.title}</h3>
 <p className="meta"><Icon n="calendar" s={14}/>{fD(n.date)}<i className="sep"/><Icon n="clock" s={14}/>{tm}</p><p className="meta"><Icon n="map-pin" s={14}/>{n.place}</p><p className="body">{n.body}</p>
 {full&&<dl><dt>Organizer</dt><dd>{n.org}</dd><dt>Date</dt><dd>{fD(n.date,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</dd><dt>Time</dt><dd>{tm}</dd><dt>Venue</dt><dd>{n.place}</dd><dt>City</dt><dd>{city}</dd><dt>Category</dt><dd>{n.cat}</dd></dl>}
 <div className="nf"><span>{n.org} · {ago(n.posted)}</span>{!full&&own&&<span className="acts2"><button className="ed" onClick={stop(onEdit)}>Edit</button><button className="rm" onClick={stop(onRemove)}><Icon n="trash-2" s={14}/>Remove</button></span>}
 {!full&&<button className="exp">Expand<Icon n="arrow-up-right" s={14}/></button>}</div></article>}
