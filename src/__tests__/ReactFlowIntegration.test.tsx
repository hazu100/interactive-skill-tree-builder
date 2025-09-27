import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("ReactFlow Integration Debug", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should create a node and verify form functionality", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Check initial state - no skills
    expect(screen.getByText("🎯 Skills: 0")).toBeInTheDocument();

    // Fill out the form
    const nameInput = screen.getByLabelText("Skill Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Test Skill");

    const descInput = screen.getByLabelText("Description");
    await user.clear(descInput);
    await user.type(descInput, "Test Description");

    // Submit the form
    const addButton = screen.getByText("Add Skill");
    await user.click(addButton);

    // After submission, the form should be cleared
    await waitFor(() => {
      const nameField = screen.getByLabelText("Skill Name") as HTMLInputElement;
      expect(nameField.value).toBe("");
    });

    // The skills count should increase to 1 (even if we can't see the node visually)
    await waitFor(() => {
      expect(screen.getByText("🎯 Skills: 1")).toBeInTheDocument();
    });
  });

  it("should handle multiple skill additions", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add first skill
    const nameInput = screen.getByLabelText("Skill Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Skill 1");

    const descInput = screen.getByLabelText("Description");
    await user.clear(descInput);
    await user.type(descInput, "Description 1");

    const addButton = screen.getByText("Add Skill");
    await user.click(addButton);

    // Wait for form to clear
    await waitFor(() => {
      const nameField = screen.getByLabelText("Skill Name") as HTMLInputElement;
      expect(nameField.value).toBe("");
    });

    // Add second skill
    await user.clear(nameInput);
    await user.type(nameInput, "Skill 2");
    await user.clear(descInput);
    await user.type(descInput, "Description 2");
    await user.click(addButton);

    // Should have 2 skills now
    await waitFor(() => {
      expect(screen.getByText("🎯 Skills: 2")).toBeInTheDocument();
    });
  });
});