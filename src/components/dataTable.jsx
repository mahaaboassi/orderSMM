// src/components/MyPaginatedTable.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';



const MyTanstackTable = ({
  columns,
  data,
  last_Page,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = parseInt(searchParams.get('page') || '1',10) -1 ;
  const pageSize = parseInt(searchParams.get('limit') || '10');
  const [ lastPage, setLastPage ] = useState(1)
  
  useEffect(()=>{
    setLastPage(last_Page)
  },[last_Page])

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    manualPagination: true,
    pageCount: lastPage,
  });
  
  const changeParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      newParams.set(key, String(value));
    });
    setSearchParams(newParams);
  }
  return (
    <div className="py-4 data-table">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2 font-medium">Rows per page:</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
              changeParams({ page: 1, limit: e.target.value })
            }}
            className="border px-2 py-1 rounded"
          >
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          Page {pageIndex+1} of {lastPage}
        </div>
      </div>

      <div key={`${pageIndex}-${pageSize}`} className='content-table'>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th className="border px-4 py-2 text-left" key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td className="border px-4 py-2" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )) :  <tr>
                  <td
                    colSpan={table.getHeaderGroups()[0]?.headers.length || 1}
                    className="border px-4 py-10 "
                  >
                    
                    <div className='flex justify-center items-center gap-3'>
                        No data found!
                    </div>
                  </td>
                </tr>}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => {
            if (pageIndex > 0) {
              changeParams({ page: pageIndex, limit: pageSize })
            }
          }}
          disabled={pageIndex <= 0}
          className="px-4 py-2  dark-btn rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={() => {
            if (pageIndex + 1 < lastPage) {
              changeParams({ page: pageIndex + 2, limit: pageSize })
            }
          }}
          disabled={pageIndex + 1 >= lastPage}
          className="px-4 py-2  dark-btn bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyTanstackTable;