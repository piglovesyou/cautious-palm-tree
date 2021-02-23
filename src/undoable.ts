export class Undoable<CellType> {
  curr;
  max: number
  hist: CellType[][] = [];
  pos: number = 0;
  constructor(data, max) {
    this.hist.push(this.curr = data);
    this.max = max
  }
  setNewValue(rowIndex, columnId, value) {
    const data = this.curr = Object.create(this.curr);
    const cellData = data[rowIndex] = Object.create(data[rowIndex]);
    cellData[columnId] = value;

    this.hist.push(data);
    if (this.hist.length > this.max)
      this.hist.shift();
    else
      this.pos = this.hist.length - 1
  }
  undo() {
    if (this.pos <= 0) {
      window.alert(`Undo's not available. You're already in the edge of history.`)
      return;
    }
    if (this.curr.__proto__ === Array.prototype) throw new Error('Never');
    let nextPos = this.pos - 1;
    if (this.hist[nextPos] !== this.curr.__proto__) throw new Error('Never');
    this.pos = nextPos;
    return this.curr = this.curr.__proto__;
  }
  redo() {
    if (this.pos >= this.max - 1) {
      window.alert(`Redo's not available. You're already in the edge of history.`)
      return;
    }
    let nextPos = this.pos + 1;
    const newData = this.hist[nextPos];
    if (!newData) throw new Error('Never');
    this.pos = nextPos;
    return this.curr = newData;
  }
  getData() {
    this.curr;
  }
  toArray() {
    return this.curr.map(e => e);
  }
}
