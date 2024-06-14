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
export const useSpace = (onSpace) => {
  useEffect(() => {
    window.addEventListener('keydown', (event) => onSpace(event))

    return () => {
      window.removeEventListener('keydown', (event) => onSpace(event))
    }
  }, [])
}
