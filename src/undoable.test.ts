import { Undoable } from "./undoable";

describe('undoable.ts', () => {
  test('undoable', () => {
    const a0 = [{a: 'a'}, {a: 'a'}, {a: 'a'}];
    const u = new Undoable<{a: string}>(a0, 10);

    u.setNewValue(2, 'a', 'blaa');
    expect(u.toArray()).toStrictEqual([{a: 'a'}, {a: 'a'}, {a: 'blaa'}])

    u.undo();
    expect(u.toArray()).toStrictEqual([{a: 'a'}, {a: 'a'}, {a: 'a'}])

    u.redo();
    expect(u.toArray()).toStrictEqual([{a: 'a'}, {a: 'a'}, {a: 'blaa'}])
  });

  test('deeper', () => {
    let alertMessage: string;
    jest.spyOn(window, 'alert').mockImplementation((m) => {alertMessage = m});

    const a0 = [{a: 'a'}, {a: 'a'}, {a: 'a'}];
    const u = new Undoable<{a: string}>(a0, 10);

    u.setNewValue(1, 'a', 'blaa1');
    u.setNewValue(0, 'a', 'blaa2');
    u.setNewValue(1, 'a', 'blaa3');
    u.setNewValue(2, 'a', 'blaa4');
    u.setNewValue(1, 'a', 'blaa5');
    u.setNewValue(2, 'a', 'blaa6');
    u.setNewValue(1, 'a', 'blaa7');
    u.setNewValue(0, 'a', 'blaa8');
    u.setNewValue(1, 'a', 'blaa9');
    u.setNewValue(1, 'a', 'blaa10');

    expect(alertMessage!).toMatchSnapshot();
    u.redo();
    expect(alertMessage!).toMatchSnapshot();
    alertMessage = ''
    expect(u.toArray()).toMatchSnapshot();

    u.undo();
    u.undo();
    u.undo();
    u.undo();
    u.undo();
    u.undo();
    u.undo();
    u.undo();
    u.undo();

    expect(alertMessage!).toStrictEqual('')
    u.undo();
    expect(alertMessage!).toMatchSnapshot();
    alertMessage = ''
    expect(u.toArray()).toMatchSnapshot();

    u.redo();
    u.redo();
    u.redo();
    u.redo();
    u.redo();
    u.redo();
    u.redo();
    u.redo();
    u.redo();

    expect(alertMessage!).toStrictEqual('')
    u.redo();
    expect(alertMessage!).toMatchSnapshot();
    alertMessage = ''
    expect(u.toArray()).toMatchSnapshot();
  })
});
