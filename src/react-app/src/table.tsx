import React, { useState, useMemo } from "react";

type Row = Record<string, string>;

interface TableProps {
  data: Row[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key] || "";
      const bVal = b[sortConfig.key] || "";
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className="cursor-pointer border-b bg-gray-100 px-4 py-2 text-left font-semibold"
              >
                {col} {sortConfig?.key === col ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="border-t px-4 py-2">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
