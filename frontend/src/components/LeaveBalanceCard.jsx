export default function LeaveBalanceCard({ title, balance }) {
  return <article className="leave-balance-card"><div className="balance-card-heading"><h2>{title}</h2><span>days</span></div><div className="balance-remaining">{balance.remaining}</div><div className="balance-breakdown"><span>Available <strong>{balance.available}</strong></span><span>Used <strong>{balance.used}</strong></span></div></article>
}
