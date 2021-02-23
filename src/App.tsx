import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList } from 'react-window';
import scrollbarWidth from './scrollbarWidth';

import makeData from './makeData';

const Styles = styled.div`

  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;

  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    /* border-bottom: 1px solid black; */
  }

  .table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;

    .tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
  `;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
      () => ({
        width: 150,
      }),
      []
  );

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useBlockLayout
  );

  const RenderRow = React.useCallback(
      ({ index, style }) => {
        const row = rows[index];
        prepareRow(row);
        return (
            <div
                { ...row.getRowProps({
                  style,
                }) }
                className="tr"
            >
              { row.cells.map(cell => {
                return (
                    <div { ...cell.getCellProps() } className="td">
                      { cell.render('Cell') }
                    </div>
                );
              }) }
            </div>
        );
      },
      [ prepareRow, rows ]
  );

  const [wh, updateWh] = useState(400);
  useEffect(() => {
    const headerHeight = document.querySelector<HTMLDivElement>('.table > :not([role="rowgroup"])')!.offsetHeight
    updateWh(window.document.body.offsetHeight - headerHeight);
  }, [])

  // Render the UI for your table
  return (

      <Styles>
        <div className="tableWrap">
          <div { ...getTableProps() } className="table">
            <div>
              { headerGroups.map(headerGroup => (
                  <div { ...headerGroup.getHeaderGroupProps() } className="tr">
                    { headerGroup.headers.map(column => (
                        <div { ...column.getHeaderProps() } className="th">
                          { column.render('Header') }
                        </div>
                    )) }
                  </div>
              )) }
            </div>

            <div { ...getTableBodyProps() }>
              <FixedSizeList
                  height={ wh }
                  itemCount={ rows.length }
                  itemSize={ 35 }
                  width={ totalColumnsWidth + scrollBarSize }
              >
                { RenderRow }
              </FixedSizeList>
            </div>
          </div>
        </div>
      </Styles>
  );
}

function App() {
  const columns = React.useMemo(
      () => [
        {
          Header: 'Row Index',
          accessor: (row, i) => i,
        },
        {
          Header: 'Name',
          columns: [
            {
              Header: 'First Name',
              accessor: 'firstName',
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
            },
          ],
        },
        {
          Header: 'Info',
          columns: [
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
        },
      ],
      []
  );

  const data = React.useMemo(() => makeData(100000), []);

  return (
      <Table columns={ columns } data={ data }/>
  );
}

export default App;
