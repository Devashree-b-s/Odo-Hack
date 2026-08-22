import { useState } from 'react'

const initialForm = { type: 'PAID', startDate: '', endDate: '', days: '1', reason: '' }

export default function LeaveRequestForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm)
  function update(field, value) { setForm((current) => ({ ...current, [field]: value })) }
  function submit(event) { event.preventDefault(); if (!form.startDate || !form.endDate || !form.reason.trim()) return; onSubmit({ ...form, days: Number(form.days) || 1 }); setForm(initialForm) }
  return <form className="leave-request-form" onSubmit={submit}><div className="form-grid"><label>Leave type<select value={form.type} onChange={(event) => update('type', event.target.value)}><option value="PAID">Paid</option><option value="SICK">Sick</option><option value="UNPAID">Unpaid</option></select></label><label>Number of days<input type="number" min="1" value={form.days} onChange={(event) => update('days', event.target.value)} /></label><label>Start date<input type="date" value={form.startDate} onChange={(event) => update('startDate', event.target.value)} required /></label><label>End date<input type="date" value={form.endDate} onChange={(event) => update('endDate', event.target.value)} required /></label></div><label>Reason<textarea value={form.reason} onChange={(event) => update('reason', event.target.value)} placeholder="Add a short reason for your request" rows="3" required /></label><button className="action-button" type="submit">Submit Request</button></form>
}
