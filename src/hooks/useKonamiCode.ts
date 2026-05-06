import { useEffect, useRef } from 'react'

const SEQUENCIA_SECRETA = [
  'p', 'a', 'y', 's', 'a', 'n', 'd', 'u',
]

export function useKonamiCode(onActivate: () => void) {
  const indexRef = useRef(0)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignora se o foco estiver em input, textarea ou select
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const expected = SEQUENCIA_SECRETA[indexRef.current]

      if (e.key === expected) {
        indexRef.current++
        if (indexRef.current === SEQUENCIA_SECRETA.length) {
          indexRef.current = 0
          onActivate()
        }
      } else {
        // Reset — but allow the current key to START a new sequence
        indexRef.current = e.key === SEQUENCIA_SECRETA[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onActivate])
}
