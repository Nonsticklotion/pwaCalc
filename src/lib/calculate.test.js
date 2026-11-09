// ทดสอบสูตร: รันด้วย  npm test
// พอใส่สูตรจริงแล้ว ให้แก้ตัวเลขที่คาดหวังให้ตรงกับตัวอย่างที่คำนวณมือไว้

import { describe, it, expect } from 'vitest'
import { calculate } from './calculate.js'
import rates from '../data/rates.json'

describe('calculate', () => {
  it('ระยะไม่เกินเหมาจ่าย คิดแค่เหมาจ่าย + เงินประกัน', () => {
    const r = calculate({ meterSize: '1/2', distance: 8, roadCrossing: false }, rates)
    expect(r.items.map((i) => i.id)).toEqual(['flat', 'deposit'])
    expect(r.subtotal).toBe(3000 + 300)
    expect(r.vat).toBe(210) // VAT 7% ของ 3,000 (เงินประกันไม่คิด VAT)
    expect(r.total).toBe(3510)
  })

  it('ระยะเกิน คิดค่าท่อส่วนเกินต่อเมตร', () => {
    const r = calculate({ meterSize: '1/2', distance: 25, roadCrossing: false }, rates)
    expect(r.items.find((i) => i.id === 'extra').amount).toBe(15 * 150)
  })

  it('กรอกระยะติดลบ ต้องขึ้น error', () => {
    const r = calculate({ meterSize: '1/2', distance: -1 }, rates)
    expect(r.errors.length).toBeGreaterThan(0)
    expect(r.total).toBe(0)
  })
})
