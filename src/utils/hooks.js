import { useEffect, useState } from 'react'

/// Dimensions
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

/// Key pressed
export const useEnter = (onEnter) => {
  useEffect(() => {
    window.addEventListener('keydown', (event) => onEnter(event))

    return () => {
      window.removeEventListener('keydown', (event) => onEnter(event))
    }
  }, [])
}
