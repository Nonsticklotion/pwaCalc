// ช่องที่ให้ผู้ใช้กรอก — เพิ่ม/ลบ/แก้ช่องได้ที่ไฟล์นี้ไฟล์เดียว
// type ที่รองรับ: 'select' | 'number' | 'checkbox'
// id ของแต่ละช่องจะถูกส่งเข้า calculate() เป็น input.<id>

import rates from '../data/rates.json'

export const fields = [
  {
    id: 'meterSize',
    label: 'ขนาดมาตรวัดน้ำ',
    type: 'select',
    options: rates.meterSizes.map((m) => ({ value: m.id, label: m.label })),
    default: rates.meterSizes[0]?.id,
    help: 'บ้านพักอาศัยทั่วไปส่วนใหญ่ใช้ 1/2 นิ้ว',
  },
  {
    id: 'distance',
    label: 'ระยะจากท่อเมนประปาถึงจุดติดมาตร',
    type: 'number',
    unit: 'เมตร',
    min: 0,
    max: 1000,
    step: 1,
    default: 10,
    help: 'วัดโดยประมาณตามแนวที่จะวางท่อ',
  },
  {
    id: 'roadCrossing',
    label: 'ต้องวางท่อลอดหรือข้ามถนน',
    type: 'checkbox',
    default: false,
  },
]

export const defaultValues = Object.fromEntries(fields.map((f) => [f.id, f.default]))
