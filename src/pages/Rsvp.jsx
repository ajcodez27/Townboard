import { useState } from 'react';
import { Modal } from '../components.jsx';
import { Icon, fD, fT } from '../utils.jsx';

export default function Rsvp({ event, existing, onSave, onRemove, onClose }) {
  const [form, setForm] = useState(existing || { name: '', contact: '', guests: '0' });
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [removed, setRemoved] = useState(false);
  const unregister = () => {
    try {
      onRemove();
      setRemoved(true);
    } catch {
      setErrors({ save: 'Your RSVP could not be removed. Please try again.' });
    }
  };
  const change = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    setErrors({ ...errors, [key]: '' });
  };
  const submit = (e) => {
    e.preventDefault();
    const next = {}, contact = form.contact.trim(), guests = Number(form.guests);
    if (!form.name.trim()) next.name = 'Enter your name.';
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const phone = /^\+?[\d\s().-]+$/.test(contact) && contact.replace(/\D/g, '').length >= 7 && contact.replace(/\D/g, '').length <= 15;
    if (!email && !phone) next.contact = 'Enter a valid email address or phone number.';
    if (String(form.guests).trim() === '' || !Number.isSafeInteger(guests) || guests < 0) next.guests = 'Enter a whole number of guests, starting at 0.';
    setErrors(next);
    if (Object.keys(next).length) {
      e.currentTarget.elements.namedItem(Object.keys(next)[0])?.focus();
      return;
    }
    try {
      onSave({ name: form.name.trim(), contact, guests });
      setConfirmed(true);
    } catch {
      setErrors({ save: 'Your RSVP could not be saved. Please try again.' });
    }
  };
  const field = (key, label, props = {}) => <label className="fld" htmlFor={`rsvp-${key}`}>
    {label}
    <input id={`rsvp-${key}`} name={key} value={form[key]} onChange={change(key)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `rsvp-${key}-error` : key === 'guests' ? 'guest-hint' : undefined} {...props} />
    {errors[key] && <em id={`rsvp-${key}-error`} role="alert">{errors[key]}</em>}
  </label>;
  return <Modal cls="rsvp-modal" onClose={onClose}>
    {removed ? <section className="rsvp-confirmation" role="status">
      <Icon n="check-circle" s={32} />
      <h2>You're unregistered</h2>
      <p>Your RSVP for <strong>{event.title}</strong> has been removed, including any guests.</p>
      <p className="rsvp-hint">Changed your mind? You can register again from the event board.</p>
      <button className="dark wide" onClick={onClose}>Done</button>
    </section> : confirmed ? <section className="rsvp-confirmation" role="status">
      <Icon n="check-circle" s={32} />
      <h2>You're registered!</h2>
      <p>Thanks, {form.name.trim()}. Your RSVP for <strong>{event.title}</strong> is saved for you{Number(form.guests) > 0 ? ` and ${form.guests} guest${Number(form.guests) === 1 ? '' : 's'}` : ''}.</p>
      <p className="rsvp-summary">{fD(event.date)} · {fT(event.time)}<br />{event.place}</p>
      <button className="dark wide" onClick={onClose}>Done</button>
    </section> : <form className="form" onSubmit={submit} noValidate>
      <h2>{existing ? 'Update your RSVP' : 'RSVP to this event'}</h2>
      <p className="rsvp-summary"><strong>{event.title}</strong><br />{fD(event.date)} · {fT(event.time)}</p>
      {field('name', 'Your name', { autoComplete: 'name', autoFocus: true })}
      {field('contact', 'Email or phone number', { type: 'text' })}
      {field('guests', 'How many guests are coming with you?', { type: 'number', min: 0, step: 1, inputMode: 'numeric' })}
      <p id="guest-hint" className="rsvp-hint">Do not count yourself. Choose 0 if you're coming on your own.</p>
      {errors.save && <p className="rsvp-error" role="alert">{errors.save}</p>}
      <div className="acts"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button className="dark">{existing ? 'Save RSVP' : 'Confirm RSVP'}</button></div>
      {existing && <button type="button" className="ghost wide unregister" onClick={unregister}>Unregister from event</button>}
    </form>}
  </Modal>;
}
