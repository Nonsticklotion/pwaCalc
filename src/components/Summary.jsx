// สรุปค่าใช้จ่าย — แสดงตาม items ที่ calculate() ส่งออกมา

const baht = (n) =>
  new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

export default function Summary({ result, vatRate, disclaimer }) {
  const { items, subtotal, vat, total, errors } = result

  return (
    <section
      aria-labelledby="sum-title"
      className="rounded-2xl border border-line bg-surface p-5 sm:p-6 print:rounded-none print:border-0 print:p-0"
    >
      <h2 id="sum-title" className="text-sm font-semibold tracking-wide text-muted">
        สรุปค่าใช้จ่ายโดยประมาณ
      </h2>

      {errors.length > 0 ? (
        <ul className="mt-4 space-y-1 rounded-lg bg-warn-soft p-3 text-sm text-warn">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-line">
            {items.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-4 py-3">
                <span className="min-w-0">
                  <span className="block">{i.label}</span>
                  {i.note && <span className="block text-sm text-muted">{i.note}</span>}
                </span>
                <span className="shrink-0 tabular-nums">{baht(i.amount)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-2 space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">รวมก่อนภาษี</dt>
              <dd className="tabular-nums">{baht(subtotal)}</dd>
            </div>
            {vatRate > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">ภาษีมูลค่าเพิ่ม {Math.round(vatRate * 1000) / 10}%</dt>
                <dd className="tabular-nums">{baht(vat)}</dd>
              </div>
            )}
          </dl>

          <div className="mt-4 flex items-baseline justify-between gap-4 rounded-xl bg-water-soft px-4 py-3">
            <span className="font-medium text-ink">รวมทั้งสิ้น</span>
            <span className="text-2xl font-semibold text-water tabular-nums">
              {baht(total)} <span className="text-base font-normal">บาท</span>
            </span>
          </div>
        </>
      )}

      <p className="mt-4 text-sm text-muted">{disclaimer}</p>

      <button
        type="button"
        onClick={() => window.print()}
        className="no-print mt-4 w-full rounded-lg border border-water px-4 py-2 font-medium text-water transition hover:bg-water hover:text-on-water focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
      >
        พิมพ์หรือบันทึกเป็น PDF
      </button>
    </section>
  )
}
