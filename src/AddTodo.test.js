import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";
import AddTodo from "./component/AddTodo.js";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("test that App component renders", () => {
  render(<App />, container);
});

test("test that App component doesn't render dupicate Task", () => {
  render(<App />);
  const inputTask = screen.getByLabelText("Add New Item");
  const inputDate = screen.getByLabelText("Due Date");
  const addButton = screen.getByTestId("new-item-button");
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Try to add the same task again
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  // Assert that only one task with "History Test" is rendered

  const tasks = screen.getAllByText(/History Test/i);
  expect(tasks.length).toBe(1);
});

test("test that App component doesn't add a task without task name", () => {
  render(<App />);
  const addButton = screen.getByTestId("new-item-button");
  fireEvent.click(addButton);

  // Assert that the task with no name is not added
  expect(screen.queryByText(/Task with no due date/i)).not.toBeInTheDocument();
});

test("test that App component doesn't add a task without due date", () => {
  render(<App />);
  const inputTask = screen.getByLabelText("Add New Item");
  const addButton = screen.getByTestId("new-item-button");
  // const inputDate = screen.getByLabelText("Due Date");

  fireEvent.change(inputTask, { target: { value: "no due date" } });
  // fireEvent.change(inputDate, { target: { value: null } });

  fireEvent.click(addButton);

  // Assert that the task with no due date is not added
  const tasks = screen.queryAllByText(/no due date/i);
  expect(tasks.length).toBe(0);
});

test("test that App component can be deleted thru checkbox", () => {
  render(<App />);
  const inputTask = screen.getByLabelText("Add New Item");
  const addButton = screen.getByTestId("new-item-button");
  const inputDate = screen.getByLabelText("Due Date");
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "Delete this taks" } });

  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Find the checkbox associated with the task
  const taskCheckbox = screen.getByTestId(/checkboxID/i);
  // Simulate clicking on the checkbox to delete the task
  fireEvent.click(taskCheckbox);

  // Ensure the task is removed from the DOM
  const tasks = screen.queryAllByText(/Delete this taks/i);
  expect(tasks.length).toBe(0);
});

test("test that App component renders different colors for past due events", () => {
  render(<App />);
  const inputTask = screen.getByLabelText("Add New Item");
  const inputDate = screen.getByLabelText("Due Date");
  const addButton = screen.getByTestId("new-item-button");
  const dueDate = "05/30/2023";

  // Set task name and due date
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });

  fireEvent.click(addButton);

  // Check background color of the card for "History Test"
  const historyCard = screen.getByTestId(/CardID/i);
  const backgroundColor = window.getComputedStyle(historyCard).backgroundColor;

  // Assert that the background color matches the expected value (adjust based on your actual styling)
  expect(backgroundColor).toContain("rgb(255, 204, 204)"); // Adjust based on your actual styling
});
