import gsap from 'gsap'

/**
 * AnimX - Unified Animation API
 * Write Once, Animate Anywhere
 */
class AnimXEngine {
  private defaultDuration = 1
  private defaultEase = 'power2.out'

  /**
   * Fade animations
   */
  fade(selector: string | HTMLElement) {
    const element = this.getElement(selector)

    return {
      in: (duration = this.defaultDuration, options = {}) => ({
        play: () => gsap.to(element, {
          opacity: 1,
          duration,
          ease: this.defaultEase,
          ...options
        }),
        withSlide: (direction: 'up' | 'down' | 'left' | 'right', distance = 50) => ({
          play: () => {
            const props = this.getSlideProps(direction, distance)
            return gsap.fromTo(element,
              { opacity: 0, ...props.from },
              { opacity: 1, ...props.to, duration, ease: this.defaultEase, ...options }
            )
          }
        })
      }),
      out: (duration = this.defaultDuration, options = {}) => ({
        play: () => gsap.to(element, {
          opacity: 0,
          duration,
          ease: this.defaultEase,
          ...options
        })
      })
    }
  }

  /**
   * Slide animations
   */
  slide(selector: string | HTMLElement) {
    const element = this.getElement(selector)

    return {
      in: (direction: 'up' | 'down' | 'left' | 'right', distance = 100, duration = this.defaultDuration) => ({
        play: () => {
          const props = this.getSlideProps(direction, distance)
          return gsap.fromTo(element,
            { ...props.from, opacity: 0 },
            { ...props.to, opacity: 1, duration, ease: this.defaultEase }
          )
        }
      }),
      out: (direction: 'up' | 'down' | 'left' | 'right', distance = 100, duration = this.defaultDuration) => ({
        play: () => {
          const props = this.getSlideProps(direction, distance)
          return gsap.to(element, {
            ...props.from,
            opacity: 0,
            duration,
            ease: this.defaultEase
          })
        }
      })
    }
  }

  /**
   * Scale animations
   */
  scale(selector: string | HTMLElement) {
    const element = this.getElement(selector)

    return {
      in: (duration = this.defaultDuration) => ({
        play: () => gsap.fromTo(element,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration, ease: 'back.out(1.7)' }
        )
      }),
      out: (duration = this.defaultDuration) => ({
        play: () => gsap.to(element, {
          scale: 0,
          opacity: 0,
          duration,
          ease: 'back.in(1.7)'
        })
      }),
      pulse: (scale = 1.1, duration = 0.3) => ({
        play: () => gsap.to(element, {
          scale,
          duration,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        })
      })
    }
  }

  /**
   * Rotate animations
   */
  rotate(selector: string | HTMLElement) {
    const element = this.getElement(selector)

    return {
      continuous: (duration = 2, direction: 'clockwise' | 'counterclockwise' = 'clockwise') => ({
        play: () => gsap.to(element, {
          rotation: direction === 'clockwise' ? 360 : -360,
          duration,
          ease: 'none',
          repeat: -1
        })
      }),
      flip: (axis: 'x' | 'y' = 'y', duration = 0.6) => ({
        play: () => gsap.to(element, {
          rotationY: axis === 'y' ? 180 : 0,
          rotationX: axis === 'x' ? 180 : 0,
          duration,
          ease: 'power2.inOut'
        })
      })
    }
  }

  /**
   * Stagger animations
   */
  stagger(selector: string, fromVars = {}, options = {}) {
    return {
      play: () => gsap.from(selector, {
        ...fromVars,
        stagger: 0.1,
        duration: this.defaultDuration,
        ease: this.defaultEase,
        ...options
      })
    }
  }

  /**
   * Timeline creation
   */
  timeline(options = {}) {
    return gsap.timeline(options)
  }

  /**
   * Scroll-based animations
   */
  onScroll(selector: string | HTMLElement) {
    const element = this.getElement(selector)

    return {
      fadeIn: () => ({
        play: (options = {}) => gsap.fromTo(element,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
              ...options
            }
          }
        )
      }),
      pin: () => ({
        play: (options = {}) => gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            pin: true,
            start: 'top top',
            end: '+=500',
            ...options
          }
        })
      })
    }
  }

  /**
   * Hover effects
   */
  hover(selector: string | HTMLElement) {
    const element = this.getElement(selector) as HTMLElement

    return {
      lift: (distance = 10) => {
        element.addEventListener('mouseenter', () => {
          gsap.to(element, { y: -distance, duration: 0.3, ease: 'power2.out' })
        })
        element.addEventListener('mouseleave', () => {
          gsap.to(element, { y: 0, duration: 0.3, ease: 'power2.out' })
        })
      },
      scale: (amount = 1.05) => {
        element.addEventListener('mouseenter', () => {
          gsap.to(element, { scale: amount, duration: 0.3, ease: 'power2.out' })
        })
        element.addEventListener('mouseleave', () => {
          gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' })
        })
      }
    }
  }

  /**
   * Helper to get element
   */
  private getElement(selector: string | HTMLElement): HTMLElement | Element {
    if (typeof selector === 'string') {
      const element = document.querySelector(selector)
      if (!element) {
        console.warn(`Element "${selector}" not found`)
        return document.createElement('div')
      }
      return element
    }
    return selector
  }

  /**
   * Helper to get slide properties
   */
  private getSlideProps(direction: 'up' | 'down' | 'left' | 'right', distance: number) {
    const props = {
      up: { from: { y: distance }, to: { y: 0 } },
      down: { from: { y: -distance }, to: { y: 0 } },
      left: { from: { x: distance }, to: { x: 0 } },
      right: { from: { x: -distance }, to: { x: 0 } }
    }
    return props[direction]
  }
}

const AnimX = new AnimXEngine()
export default AnimX
export { AnimXEngine }
