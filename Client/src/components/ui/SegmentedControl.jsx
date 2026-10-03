/** Small set of mutually exclusive options (tabs, filters). */
export default function SegmentedControl({ label, options, value, onChange, className = '' }) {
  return (
    <div className={`segmented ${className}`.trim()} role="group" aria-label={label}>
      {options.map((option) => {
        const id = typeof option === 'string' ? option : option.id
        const text = typeof option === 'string' ? option : option.label
        return (
          <button
            key={id}
            type="button"
            className="segmented__option"
            aria-pressed={value === id}
            onClick={() => onChange(id)}
          >
            {text}
          </button>
        )
      })}
    </div>
  )
}
