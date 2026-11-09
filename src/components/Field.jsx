// แสดงช่องกรอกตาม type ใน src/config/form.js — ปกติไม่ต้องแก้

export default function Field({ field, value, onChange, index }) {
  const id = `f-${field.id}`

  if (field.type === 'checkbox') {
    return (
      <div className="flex gap-4">
        <StepNo n={index} />
        <label htmlFor={id} className="flex flex-1 cursor-pointer items-start gap-3 pt-1">
          <input
            id={id}
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-1 size-5 accent-water"
          />
          <span>
            <span className="font-medium">{field.label}</span>
            {field.help && <span className="mt-1 block text-sm text-muted">{field.help}</span>}
          </span>
        </label>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <StepNo n={index} />
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block font-medium">
          {field.label}
        </label>
        {field.help && <p className="mt-1 text-sm text-muted">{field.help}</p>}

        {field.type === 'select' && (
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={field.label}>
            {field.options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={value === o.value}
                onClick={() => onChange(o.value)}
                className={`rounded-lg border px-4 py-2 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water ${
                  value === o.value
                    ? 'border-water bg-water text-on-water'
                    : 'border-line bg-surface hover:border-water'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        {field.type === 'number' && (
          <div className="mt-3 flex max-w-60 items-stretch overflow-hidden rounded-lg border border-line bg-surface focus-within:border-water focus-within:ring-2 focus-within:ring-water/20">
            <input
              id={id}
              type="number"
              inputMode="decimal"
              min={field.min}
              max={field.max}
              step={field.step}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full min-w-0 px-3 py-2 text-lg tabular-nums outline-none"
            />
            {field.unit && (
              <span className="flex items-center border-l border-line bg-paper px-3 text-sm text-muted">
                {field.unit}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StepNo({ n }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-water-soft text-sm font-semibold text-water tabular-nums">
      {n}
    </span>
  )
}
