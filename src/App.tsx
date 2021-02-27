import React, {
  PureComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FocusEvent } from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import debounce from 'lodash.debounce'

import makeData from './makeData'
import { Undoable } from './undoable'

const EditableCell = ({
  value: initialValue,
  rowIndex,
  columnAccessor,
  updateMyData,
}) => {
  const valueRef = useRef<string>('')

  const onBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    if (valueRef.current === value) return
    updateMyData(rowIndex, columnAccessor, value)
  }, [])

  const onFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    valueRef.current = e.currentTarget.value
  }, [])

  return <input defaultValue={initialValue} onFocus={onFocus} onBlur={onBlur} />
}

class ItemRenderer extends PureComponent<ListChildComponentProps> {
  render() {
    const {
      data: { columns, data, updateMyData },
      index: rowIndex,
      style: rowStyle,
    } = this.props

    const row = data[rowIndex]
    const rowKey = `row_${rowIndex}`

    return (
      <div style={rowStyle} className="tr" role="row">
        {columns.map((column) => {
          const { accessor, width, Header } = column
          if (typeof accessor === 'function') {
            return (
              <div className="td" role="cell" key={Header}>
                {accessor(row, rowIndex)}
              </div>
            )
          }
          const value = row[accessor]
          const style = width ? { width } : undefined

          // This is the trick to force rerender the DOM.
          // In production, the modifiable factor could be timestamp.
          const key = `${rowKey}-${Header}--${value}`

          return (
            <div key={key} className="td" style={style} role="cell">
              <EditableCell
                value={value}
                columnAccessor={accessor}
                rowIndex={rowIndex}
                updateMyData={updateMyData}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

type Size = [number, number]

function getTableBodySize(): Size {
  const viewport = document.querySelector<HTMLDivElement>('#root')!
  const tableBody = document.querySelector<HTMLDivElement>('.tableBody')!
  return [viewport.offsetWidth, viewport.offsetHeight - tableBody.getBoundingClientRect().top]
}

function Table({ columns, data, updateMyData }) {
  const [[w, h], updateSize] = useState([2000, 2000])

  useEffect(() => {
    window.addEventListener(
      'resize',
      debounce(() => {
        updateSize(getTableBodySize())
      }, 200)
    )
    updateSize(getTableBodySize())
  }, [])

  return (
    <div className="tableWrap">
      <div className="table">
        <div className="tr" role="row">
          {columns.map(({ Header, accessor, width }) => {
            const style = width ? { width } : undefined
            return (
              <div key={accessor} className="th" style={style} role="cell">
                {Header}
              </div>
            )
          })}
        </div>

        <FixedSizeList
          className="tableBody"
          width={w}
          height={h}
          itemCount={data.length}
          itemSize={35}
          itemData={{ columns, data, updateMyData }}
        >
          {ItemRenderer}
        </FixedSizeList>
      </div>
    </div>
  )
}

function App() {
  const columns = useMemo(
    () => [
      {
        Header: 'Row Index',
        accessor: (row, i) => i,
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Age',
        accessor: 'age',
        width: 50,
      },
      {
        Header: 'Visits',
        accessor: 'visits',
        width: 60,
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress',
      },
    ],
    []
  )

  const undoable = useMemo(() => new Undoable(makeData(100000), 10), [])
  const [data, setData] = React.useState(undoable.getData())

  const updateMyData = (rowIndex, columnId, value) => {
    setData(undoable.setNewValue(rowIndex, columnId, value).toArray())
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (!e.metaKey) return
      if (e.key !== 'z') return
      if (e.shiftKey) setData(undoable.redo().toArray())
      else setData(undoable.undo().toArray())
      e.preventDefault()
    })
  }, [])

  return (
    <>
      <div className="toolbar">
        <div>The cells are editable. Hit <code>meta+z/meta+shift/z</code> to undo/redo. Note it saves the value on blur. View source on <a href="https://github.com/piglovesyou/cautious-palm-tree">GitHub</a>.</div>
        <button
          className="button1"
          onClick={() => {
            for (const r of document.querySelectorAll<HTMLDivElement>(
              '[role="cell"]'
            )!)
              r.style.backgroundColor = 'lightblue'
          }}
        >
          Paint cells to check what was re-render
        </button>
      </div>
      <Table columns={columns} data={data} updateMyData={updateMyData} />
    </>
  )
}

export default App
