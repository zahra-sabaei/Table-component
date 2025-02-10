import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const Table = ({ columns, pageSize = 5 }) => {
  // States
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetching Data from Local API
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  // Reset Pagination when Search or Filter Changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // Filter and Search Data
  const filteredAndSearchedData = useMemo(() => {
    return data
      .filter((row) =>
        columns.some(
          (col) =>
            row[col.accessor]
              ?.toString()
              .toLowerCase()
              .includes(search.toLowerCase())
        )
      )
      .filter((row) =>
        filter ? row.category?.toLowerCase().trim() === filter.toLowerCase().trim() : true
      );
  }, [search, filter, data, columns]);

  // Calculate Total Pages
  const totalPageNumber = Math.ceil(filteredAndSearchedData.length / pageSize);

  // Slice Data for Current Page
  const pagedData = useMemo(() => {
    return filteredAndSearchedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredAndSearchedData, pageSize, currentPage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        {/* Title (Centered) */}
        <h2 className="text-xl font-bold text-center mb-4">Data Table</h2>

        {/* Search & Filter Inputs (Aligned in One Line & Centered) */}
        <div className="flex justify-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-1/2"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            name="filter"
            className="border p-2 rounded w-1/2"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(data.map((item) => item.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredAndSearchedData.length > 0 ? (
          <>
            {/* Table */}
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {columns.map((col) => (
                    <th key={col.accessor} className="border p-2 text-left">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedData.map((dt, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {columns.map((col) => (
                      <td key={col.accessor} className="border p-2 text-center">
                        {dt[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination (Includes Page Numbers) */}
            <div className="flex justify-between mt-4 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {/* Page Number Buttons */}
              <div className="flex gap-2">
                {Array.from({ length: totalPageNumber }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPageNumber, prev + 1))}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === totalPageNumber}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center">No data found</p>
        )}
      </div>
    </div>
  );
};

export default Table;
