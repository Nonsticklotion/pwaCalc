import { useMemo, useState } from 'react'
import rates from './data/rates.json'
import { fields, defaultValues } from './config/form.js'
import { site } from './config/site.js'
import { calculate } from './lib/calculate.js'
import Field from './components/Field.jsx'
import Summary from './components/Summary.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

// แปลงค่าที่กรอกเป็นข้อความอ่านง่าย สำหรับหน้าพิมพ์
function displayValue(field, value) {
  if (field.type === 'select') return field.options.find((o) => o.value === value)?.label ?? '-'
  if (field.type === 'checkbox') return value ? 'ใช่' : 'ไม่ใช่'
  return `${value}${field.unit ? ` ${field.unit}` : ''}`
}

export default function App() {
  const [values, setValues] = useState(defaultValues)
  const result = useMemo(() => calculate(values, rates), [values])
  const set = (id) => (v) => setValues((prev) => ({ ...prev, [id]: v }))
  // คำนวณวันที่ครั้งเดียวตอนเปิดหน้า ไม่คำนวณใหม่ทุกครั้งที่ render
  const [today] = useState(() => new Date().toLocaleDateString('th-TH', { dateStyle: 'long' }))

  return (
    <div className="min-h-dvh bg-paper text-ink print:min-h-0 print:bg-white">
      <header className="border-b border-line bg-surface print:border-b-2 print:border-ink">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-4 py-6 sm:py-8 print:px-0 print:py-0 print:pb-3">
          <div className="min-w-0">
            {site.branchName && <p className="text-sm font-medium text-water">{site.branchName}</p>}
            <h1 className="mt-1 text-2xl font-semibold text-balance sm:text-3xl print:text-xl">
              {site.title}
            </h1>
            <p className="mt-2 max-w-prose text-muted print:hidden">{site.subtitle}</p>
            <p className="mt-1 hidden text-sm text-muted print:block">วันที่ประเมิน {today}</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {rates.isSample && (
        <div className="border-b border-warn/30 bg-warn-soft print:mt-3 print:border print:rounded-md">
          <p className="mx-auto max-w-5xl px-4 py-2 text-sm text-warn">
            ตัวเลขในหน้านี้เป็นอัตราตัวอย่าง ยังไม่ใช่อัตราจริง
          </p>
        </div>
      )}

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:py-8 md:grid-cols-[minmax(0,1fr)_380px] print:block print:px-0 print:py-4">
        {/* ฟอร์มสำหรับหน้าจอ */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-7 rounded-2xl border border-line bg-surface p-5 sm:p-6 print:hidden"
        >
          <h2 className="text-sm font-semibold tracking-wide text-muted">ข้อมูลการขอใช้น้ำ</h2>
          {fields.map((f, i) => (
            <Field key={f.id} field={f} index={i + 1} value={values[f.id]} onChange={set(f.id)} />
          ))}
        </form>

        {/* ข้อมูลที่กรอก แบบย่อ สำหรับหน้าพิมพ์ */}
        <section className="mb-4 hidden print:block">
          <h2 className="text-sm font-semibold tracking-wide text-muted">ข้อมูลการขอใช้น้ำ</h2>
          <dl className="mt-2 divide-y divide-line border-y border-line">
            {fields.map((f) => (
              <div key={f.id} className="flex justify-between gap-4 py-2">
                <dt className="text-muted">{f.label}</dt>
                <dd className="text-right font-medium">{displayValue(f, values[f.id])}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="md:sticky md:top-6 md:self-start print:static">
          <Summary result={result} vatRate={rates.vatRate} disclaimer={site.disclaimer} />
        </div>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-muted print:px-0 print:pb-0">
        {rates.effectiveDate && <p>อัตราที่ใช้คำนวณ มีผลตั้งแต่ {rates.effectiveDate}</p>}
        {site.contact.phone && <p>สอบถามเพิ่มเติม โทร {site.contact.phone}</p>}
        {site.contact.address && <p>{site.contact.address}</p>}
      </footer>
    </div>
  )
}
