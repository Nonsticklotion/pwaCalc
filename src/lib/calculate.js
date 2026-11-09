// =====================================================================
//  สูตรคำนวณค่าติดตั้ง  ← ใส่สูตรจริงที่ไฟล์นี้
// ---------------------------------------------------------------------
//  ตอนนี้เป็น "สูตรตัวอย่าง" เพื่อให้หน้าเว็บทำงานได้ก่อน
//
//  รับเข้า : input  = ค่าที่ผู้ใช้กรอก (id ตรงกับ src/config/form.js)
//           rates  = ตารางอัตรา (src/data/rates.json)
//  ส่งออก : { items, subtotal, vat, total, errors }
//           items = [{ id, label, amount, note?, vat? }]
//             vat: true  = รายการนี้คิด VAT
//             vat: false = ไม่คิด VAT (เช่น เงินประกัน)
//
//  หน้าเว็บจะแสดงรายการตาม items ที่ส่งออกไปเอง ไม่ต้องแก้ UI
// =====================================================================

export function calculate(input, rates) {
  const errors = validate(input, rates)
  if (errors.length) return { items: [], subtotal: 0, vat: 0, total: 0, errors }

  const meter = rates.meterSizes.find((m) => m.id === input.meterSize)
  const distance = Number(input.distance) || 0
  const items = []

  // 1) ค่าติดตั้งเหมาจ่าย (รวมระยะไม่เกิน flatDistance เมตร)
  items.push({
    id: 'flat',
    label: `ค่าติดตั้งเหมาจ่าย มาตร ${meter.label}`,
    note: `รวมระยะไม่เกิน ${meter.flatDistance} เมตร`,
    amount: meter.flatFee,
    vat: true,
  })

  // 2) ค่าวางท่อส่วนที่เกินระยะเหมาจ่าย
  const extraMeters = Math.max(0, distance - meter.flatDistance)
  if (extraMeters > 0) {
    items.push({
      id: 'extra',
      label: 'ค่าวางท่อส่วนเกิน',
      note: `${fmt(extraMeters)} เมตร × ${fmt(meter.extraPerMeter)} บาท`,
      amount: extraMeters * meter.extraPerMeter,
      vat: true,
    })
  }

  // 3) งานลอด/ข้ามถนน
  if (input.roadCrossing) {
    items.push({
      id: 'road',
      label: 'ค่าวางท่อลอดหรือข้ามถนน',
      amount: rates.extras.roadCrossing,
      vat: true,
    })
  }

  // 4) เงินประกันการใช้น้ำ (ไม่คิด VAT)
  items.push({
    id: 'deposit',
    label: 'เงินประกันการใช้น้ำ',
    amount: meter.deposit,
    vat: false,
  })

  return summarize(items, rates.vatRate)
}

// ---------------------------------------------------------------------
//  ตรวจค่าที่กรอก — คืนค่าเป็นข้อความ error (ภาษาที่ผู้ใช้อ่านเข้าใจ)
// ---------------------------------------------------------------------
export function validate(input, rates) {
  const errors = []
  if (!rates.meterSizes.some((m) => m.id === input.meterSize)) {
    errors.push('กรุณาเลือกขนาดมาตรวัดน้ำ')
  }
  const d = Number(input.distance)
  if (input.distance === '' || Number.isNaN(d) || d < 0) {
    errors.push('กรุณากรอกระยะเป็นตัวเลขตั้งแต่ 0 เมตรขึ้นไป')
  }
  return errors
}

// ---------------------------------------------------------------------
//  รวมยอด + VAT (ปัดเศษ 2 ตำแหน่ง) — ปกติไม่ต้องแก้
// ---------------------------------------------------------------------
export function summarize(items, vatRate = 0) {
  const round = (n) => Math.round(n * 100) / 100
  const subtotal = round(items.reduce((s, i) => s + i.amount, 0))
  const vatBase = items.filter((i) => i.vat).reduce((s, i) => s + i.amount, 0)
  const vat = round(vatBase * vatRate)
  return { items, subtotal, vat, total: round(subtotal + vat), errors: [] }
}

const fmt = (n) => new Intl.NumberFormat('th-TH').format(n)
