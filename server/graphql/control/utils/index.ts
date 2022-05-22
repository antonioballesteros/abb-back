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

export const getQuality = (control:any, value: number | null) => {
  // Problem loading values ??
  if (value === null) return 'BAD'

  // USEFUL ?
  if (value === control.nominal) {
    return 'PERFECT'
  }

  if (
    control.nominal + control.dev1 > value &&
    control.nominal - control.dev1 < value
  ) {
    return 'GOOD'
  }

  if (
    control.nominal + control.dev2 > value &&
    control.nominal - control.dev2 < value
  ) {
    return 'WARNING'
  }

  return 'BAD'
}

export const getWorstQuality = (controls:any[]) => {
  return controls.reduce(
    (previousValue, currentValue) => {
      if (!currentValue.quality) return previousValue
      if (currentValue.quality === 'BAD' || previousValue === 'BAD') return 'BAD'
      if (currentValue.quality === 'WARNING' || previousValue === 'WARNING') return 'WARNING'
      if (currentValue.quality === 'GOOD' || previousValue === 'GOOD') return 'GOOD'

      return 'PERFECT'
    },
    null
  )
}
