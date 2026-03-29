import { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pm-theme')
    if (saved) return saved
    // Respect system preference on first visit
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pm-theme', theme)
    // Update all theme-color metas for iOS status bar
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      const mq = meta.getAttribute('media')
      if (!mq || mq.includes('light')) {
        meta.content = theme === 'dark' ? '#0d0f14' : '#f0f2f5'
      } else if (mq.includes('dark')) {
        meta.content = theme === 'dark' ? '#060608' : '#f0f2f5'
      }
    })
  }, [theme])

  function toggle() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
