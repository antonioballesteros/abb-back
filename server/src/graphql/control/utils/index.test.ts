import { updateLast } from './'
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
