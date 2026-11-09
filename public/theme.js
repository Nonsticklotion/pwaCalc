// โหลดก่อนหน้าเว็บแสดง เพื่อใช้โหมดสีที่ผู้ใช้เลือกไว้ครั้งก่อน (ไม่ให้จอกระพริบ)
// ค่าเริ่มต้นคือโหมดมืด
try {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.dataset.theme = 'light'
  }
} catch {
  // เบราว์เซอร์บล็อก localStorage ก็ใช้โหมดมืดไป
}
