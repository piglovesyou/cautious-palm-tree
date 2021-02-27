import { Undoable } from './undoable'

describe('undoable.ts', () => {
  test('undoable', () => {
    const a0 = [{ a: 'a' }, { a: 'a' }, { a: 'a' }]
    const u = new Undoable<{ a: string }>(a0, 10)

    u.setNewValue(2, 'a', 'blaa')
    expect(u.toArray()).toStrictEqual([{ a: 'a' }, { a: 'a' }, { a: 'blaa' }])

    u.undo()
    expect(u.toArray()).toStrictEqual([{ a: 'a' }, { a: 'a' }, { a: 'a' }])

    u.redo()
    expect(u.toArray()).toStrictEqual([{ a: 'a' }, { a: 'a' }, { a: 'blaa' }])
  })

  test('deeper', () => {
    let alertMessage: string = ''
    jest.spyOn(window, 'alert').mockImplementation((m) => {
      alertMessage = m
    })

    const a0 = [{ a: 'a' }, { a: 'a' }, { a: 'a' }]
    const u = new Undoable<{ a: string }>(a0, 10)

    expect(alertMessage).toStrictEqual('')
    u.redo()
    expect(alertMessage!).toMatch(/^Unable to redo\./)
    alertMessage = ''

    u.setNewValue(1, 'a', 'blaa1')
    u.setNewValue(0, 'a', 'blaa2')
    u.setNewValue(1, 'a', 'blaa3')
    u.setNewValue(2, 'a', 'blaa4')
    u.setNewValue(1, 'a', 'blaa5')
    u.setNewValue(2, 'a', 'blaa6')
    u.setNewValue(1, 'a', 'blaa7')
    u.setNewValue(0, 'a', 'blaa8')
    u.setNewValue(1, 'a', 'blaa9')
    u.setNewValue(2, 'a', 'blaa10')

    expect(alertMessage).toMatch('')
    u.redo()
    expect(alertMessage!).toMatch(/^Unable to redo\./)
    alertMessage = ''
    expect(u.toArray()).toStrictEqual([
      { a: 'blaa8' },
      { a: 'blaa9' },
      { a: 'blaa10' },
    ])

    u.undo()
    u.undo()
    u.undo()
    u.undo()
    u.undo()
    u.undo()
    u.undo()
    u.undo()
    u.undo()
    u.undo()

    expect(alertMessage!).toStrictEqual('')
    u.undo()
    expect(alertMessage!).toMatch(/^Unable to undo\./)
    alertMessage = ''
    expect(u.toArray()).toStrictEqual(a0)

    u.redo()
    u.redo()
    u.redo()
    u.redo()
    u.redo()
    u.redo()
    u.redo()
    u.redo()
    u.redo()
    u.redo()

    expect(alertMessage!).toMatch('')
    u.redo()
    expect(alertMessage!).toMatch(/^Unable to redo\./)
    alertMessage = ''
    expect(u.toArray()).toStrictEqual([
      { a: 'blaa8' },
      { a: 'blaa9' },
      { a: 'blaa10' },
    ])
  })
})
