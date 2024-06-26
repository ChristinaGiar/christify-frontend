// for arrays & single values
export const isEmpty = (value) => {
  return value && Object.keys(value).length === 0
}

// check if an object and its content are empty
export const isEmptyObject = (value) => {
  return Object.values(value).every((val) =>
    typeof val === 'object' ? isEmptyObject(val) : !val
  )
}

export const artistsArrayToString = (array) => {
  return array.reduce((acc, artist) => {
    if (array[0] == artist) {
      return artist.name
    }
    return acc + ', ' + artist.name
  }, '')
}
