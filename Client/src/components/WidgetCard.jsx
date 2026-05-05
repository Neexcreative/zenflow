export default function WidgetCard({ title, headerRight, children, className = '', accent = false }) {
  return (
    <section className={`widget-card ${accent ? 'widget-card-accent' : ''} ${className}`.trim()}>
      <div className="widget-card-header">
        <span className="widget-card-title">{title}</span>
        {headerRight}
      </div>
      <div className="widget-card-body">{children}</div>
    </section>
  )
}
