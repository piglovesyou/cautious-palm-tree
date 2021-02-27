export class Undoable<RowType extends Record<string, any>> {
  data: RowType[]
  max: number
  hist: any[] = []
  pos: number = -1

  constructor(data, max) {
    this.data = Array.from(data) // capture the array to prevent destruction from outside
    this.max = max
  }
  setNewValue(rowIndex, columnId, value) {
    const oldRowData = this.data[rowIndex]
    if (!oldRowData) throw new Error('Never')
    const newRowData = Object.create(oldRowData)
    newRowData[columnId] = value
    this.data[rowIndex] = newRowData
    this.hist.push([rowIndex, newRowData])

    if (this.hist.length > this.max) this.hist.shift()
    else this.pos = this.hist.length - 1
    return this
  }
  undo() {
    if (this.pos < 0) {
      window.alert(`Unable to undo. You're already in the edge of history.`)
      return this
    }
    const [rowIndex, currRowRef] = this.hist[this.pos]
    this.data[rowIndex] = currRowRef.__proto__
    this.pos--
    return this
  }
  redo() {
    if (!this.hist[this.pos + 1]) {
      window.alert(`Unable to redo. You're already in the edge of history.`)
      return this
    }
    if (this.pos + 1 >= this.max) throw new Error('Never')
    const [rowIndex, newRowRef] = this.hist[this.pos + 1]
    this.data[rowIndex] = newRowRef
    this.pos++
    return this
  }
  getData() {
    return this.data
  }
  toArray() {
    return this.data.map((e) => e)
  }
}
