export default function ProfileSection({ title, children }) {
  return <section className="profile-section"><h2>{title}</h2><dl className="info-grid">{children}</dl></section>
}
