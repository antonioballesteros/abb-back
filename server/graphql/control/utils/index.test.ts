import { updateLast, getQuality, getWorstQuality } from '.'
describe('testing updateLast', () => {
  test('empty updateLast not modified if no new value is received', () => {
    const prevList: number[] = []
    const prevString = JSON.stringify(prevList)
    const result = updateLast(prevString, null)
    expect(prevString).toBe(result)
  })

  test('empty updateLast add new value', () => {
    const prevList: number[] = []
    const prevString = JSON.stringify(prevList)
    const afterList = [1, ...prevList]
    const afterString = JSON.stringify(afterList)

    const result = updateLast(prevString, 1)
    expect(afterString).toBe(result)
  })

  test('updateLast with value not modified if no new values is received', () => {
    const prevList: number[] = [1, 2, 3]
    const prevString = JSON.stringify(prevList)

    const result = updateLast(prevString, null)
    expect(prevString).toBe(result)
  })

  test('new value is inserted on first position', () => {
    const prevList: number[] = [1, 2, 3]
    const prevString = JSON.stringify(prevList)
    const afterList = [9, ...prevList]
    const afterString = JSON.stringify(afterList)

    const result = updateLast(prevString, 9)
    expect(afterString).toBe(result)
  })

  test('values after 10th position are removed', () => {
    const prevList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const prevString = JSON.stringify(prevList)
    const afterList = [999, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const afterString = JSON.stringify(afterList)

    const result = updateLast(prevString, 999)
    expect(afterString).toBe(result)
  })

  test('check no problems with float values', () => {
    const prevList: number[] = [0.1, 0.2, 0.3]
    const prevString = JSON.stringify(prevList)
    const afterList = [0.4, ...prevList]
    const afterString = JSON.stringify(afterList)

    const result = updateLast(prevString, 0.4)
    expect(afterString).toBe(result)
  })
})

describe('testing getQualityControl', () => {
  const createControl = () => {
    return {
      id: 'test-a',
      name: 'testing control',
      nominal: 10,
      dev1: 2,
      dev2: 4
    }
  }

  test('getQualityControl PERFECT', () => {
    const control = createControl()
    const quality = getQuality(control, 10)

    expect(quality).toEqual('PERFECT')
  })

  test('getQualityControl GOOD', () => {
    const control = createControl()
    const qualityAbove = getQuality(control, 11)

    expect(qualityAbove).toEqual('GOOD')

    const qualityBelow = getQuality(control, 9)

    expect(qualityBelow).toEqual('GOOD')
  })

  test('getQualityControl WARNING', () => {
    const control = createControl()
    const qualityAbove = getQuality(control, 13)

    expect(qualityAbove).toEqual('WARNING')

    const qualityBelow = getQuality(control, 7)

    expect(qualityBelow).toEqual('WARNING')
  })

  test('getQualityControl BAD', () => {
    const control = createControl()
    const qualityAbove = getQuality(control, 15)

    expect(qualityAbove).toEqual('BAD')

    const qualityBelow = getQuality(control, 5)

    expect(qualityBelow).toEqual('BAD')
  })
})

describe('testing getWorstQuality', () => {
  test('no values reported yet, only nulls', () => {
    const controls = [{
      quality: null
    }, {
      quality: null
    }, {
      quality: null
    }, {
      quality: null
    }]

    const newQuality = getWorstQuality(controls)

    expect(newQuality).toBeNull()
  })

  test('Nulls values are discarted', () => {
    const controls = [{
      quality: null
    }, {
      quality: 'GOOD'
    }]

    const newQuality = getWorstQuality(controls)

    expect(newQuality).toEqual('GOOD')
  })

  test('at least one BAD found', () => {
    const controls = [{
      quality: 'BAD'
    }, {
      quality: 'GOOD'
    }, {
      quality: null
    }, {
      quality: 'WARNING'
    }, {
      quality: 'PERFECT'
    }]

    const newQuality = getWorstQuality(controls)

    expect(newQuality).toEqual('BAD')
  })

  test('at least one WARNING found and no BADs', () => {
    const controls = [{
      quality: null
    }, {
      quality: 'GOOD'
    }, {
      quality: null
    }, {
      quality: 'WARNING'
    }, {
      quality: 'PERFECT'
    }]

    const newQuality = getWorstQuality(controls)

    expect(newQuality).toEqual('WARNING')
  })

  test('at least one GOOD found and no BADs and no WARNINGs', () => {
    const controls = [{
      quality: null
    }, {
      quality: 'GOOD'
    }, {
      quality: 'GOOD'
    }, {
      quality: null
    }, {
      quality: 'PERFECT'
    }]

    const newQuality = getWorstQuality(controls)

    expect(newQuality).toEqual('GOOD')
  })

  test('only PERFECTs', () => {
    const controls = [{
      quality: 'PERFECT'
    }, {
      quality: null
    }, {
      quality: 'PERFECT'
    }, {
      quality: null
    }, {
      quality: null
    }]

    const newQuality = getWorstQuality(controls)

    expect(newQuality).toEqual('PERFECT')
  })
})
