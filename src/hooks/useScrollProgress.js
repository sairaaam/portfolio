import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollProgress() {
  const scrollProgress = useRef(0)
  const smoothProgress = useRef(0)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '.scroll-wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        scrollProgress.current = self.progress
      },
    })

    return () => trigger.kill()
  }, [])

  return { scrollProgress, smoothProgress }
}
