export const updateLast = (last: string, newValue: number | null): string => {
  let newLasts = []
  try {
    newLasts = JSON.parse(last)
  } catch (_) {
    newLasts = []
  }

  if (newValue !== null) {
    newLasts.unshift(newValue)
  }

  return JSON.stringify(newLasts.slice(0, 10))
}
