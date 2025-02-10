import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Table from "./Table";

const mock = new MockAdapter(axios);

const columns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Price", accessor: "price" },
  { header: "Category", accessor: "category" },
];

const mockData = [
  { id: 1, name: "Product A", price: 100, category: "Electronics" },
  { id: 2, name: "Product B", price: 200, category: "Clothing" },
  { id: 3, name: "Product C", price: 150, category: "Electronics" },
  { id: 4, name: "Product D", price: 190, category: "Electronics" },
  { id: 5, name: "Product E", price: 250, category: "Clothing" },
];

describe("Table Component", () => {
  beforeEach(() => {
    mock.onGet("http://localhost:5000/products").reply(200, mockData);
  });

  afterEach(() => {
    mock.reset();
  });

  test("renders table with data", async () => {
    render(<Table columns={columns} pageSize={2} />);
    
    // Wait for data to load
    await waitFor(() => expect(screen.getByText("Product A")).toBeInTheDocument());

    // Check if table headers exist
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
  });

  test("filters data by category", async () => {
    render(<Table columns={columns} pageSize={5} />);
    
    await waitFor(() => expect(screen.getByText("Product A")).toBeInTheDocument());

    // Select "Clothing" from filter dropdown
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Clothing" } });

    // Check if only "Clothing" products exist
    await waitFor(() => {
      expect(screen.getByText("Product B")).toBeInTheDocument();
      expect(screen.getByText("Product D")).toBeInTheDocument();
      expect(screen.getByText("Product E")).toBeInTheDocument();
    });
  });

  test("search filters table results", async () => {
    render(<Table columns={columns} pageSize={5} />);
    
    await waitFor(() => expect(screen.getByText("Product A")).toBeInTheDocument());

    // Type "Product B" in search box
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "Product B" } });

    // Check that only Product B is displayed
    await waitFor(() => {
      expect(screen.getByText("Product B")).toBeInTheDocument();
      expect(screen.queryByText("Product A")).not.toBeInTheDocument();
    });
  });

  test("pagination works correctly", async () => {
    render(<Table columns={columns} pageSize={2} />);
    
    await waitFor(() => expect(screen.getByText("Product A")).toBeInTheDocument());

    // Click "Next" button
    fireEvent.click(screen.getByText("Next"));

    // Expect new items to appear
    await waitFor(() => {
      expect(screen.getByText("Product C")).toBeInTheDocument();
      expect(screen.getByText("Product D")).toBeInTheDocument();
    });
  });
});
