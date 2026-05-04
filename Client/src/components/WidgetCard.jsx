export default function WidgetCard({ title, headerRight, children, className = '' }) {
  return (
    <section className={`widget-card ${className}`.trim()}>
      <div className="widget-card-header">
        <span className="widget-card-title">{title}</span>
        {headerRight}
      </div>
      <div className="widget-card-body">{children}</div>
    </section>
  )
}
