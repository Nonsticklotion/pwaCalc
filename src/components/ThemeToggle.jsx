import { useState } from 'react'

// ปุ่มสลับโหมดมืด/สว่าง — ค่าเริ่มต้นโหมดมืด จำค่าที่เลือกไว้ในเบราว์เซอร์

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'light') document.documentElement.dataset.theme = 'light'
    else delete document.documentElement.dataset.theme
    try {
      localStorage.setItem('theme', next)
    } catch {
      // บันทึกไม่ได้ก็ไม่เป็นไร
    }
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
      className="no-print flex shrink-0 items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted transition hover:border-water hover:text-water focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span className="hidden sm:inline">{isDark ? 'โหมดสว่าง' : 'โหมดมืด'}</span>
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  )
}
