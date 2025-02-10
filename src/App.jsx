import React from "react";
import Table from "./components/table";

const columns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Price", accessor: "price" },
  { header: "Category", accessor: "category" },
];

const App = () => {
  return (
    <div className="p-6">
    <h2 className="text-xl font-bold mb-4 text-center">Data Table</h2>
    <Table  columns={columns} pageSize={2} />
  </div>
  
  
  );
};

export default App;
