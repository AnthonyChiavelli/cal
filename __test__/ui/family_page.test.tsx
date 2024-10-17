import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Decimal } from "@prisma/client/runtime/library";
import "@testing-library/jest-dom";
import FamilyPage from "@/app/components/family_page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  usePathname() {
    return {};
  },
}));

const mockFamily = {
  id: "f1",
  createdAt: new Date("10/09/1990"),
  updatedAt: new Date("10/09/1990"),
  ownerId: "test@test.com",
  balance: 3 as unknown as Decimal,
  familyName: "Smith",
  parents: [
    {
      id: "1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      ownerId: "1",
      familyId: "1",
      firstName: "John",
      lastName: "Smith",
      phone: "+15554443333",
      email: "",
      isPrimary: true,
    },
    {
      id: "2",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      ownerId: "1",
      familyId: "1",
      firstName: "Jane",
      lastName: "Smith",
      phone: "+17775553333",
      email: "",
      isPrimary: false,
    },
  ],
  notes: "Some notes",
  students: [
    {
      id: "s1",
      createdAt: new Date("10/09/1990"),
      updatedAt: new Date("10/09/1990"),
      ownerId: "test@test.com",
      familyId: "f1",
      firstName: "Johnny",
      lastName: "Smith",
      gradeLevel: 1,
      notes: "",
    },
  ],
};

describe("FamilyPage", () => {
  it("Renders a consistent snapshot when empty", async () => {
    const container = render(
      <FamilyPage
        updateOrCreateFamily={() => Promise.resolve({ success: true })}
        deleteFamily={() => Promise.resolve({ success: true })}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("Renders a consistent snapshot when prefilled with data", async () => {
    const container = render(
      <FamilyPage
        updateOrCreateFamily={() => Promise.resolve({ success: true })}
        deleteFamily={() => Promise.resolve({ success: true })}
        family={mockFamily}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("Renders properly when empty", async () => {
    render(
      <FamilyPage
        updateOrCreateFamily={() => Promise.resolve({ success: true })}
        deleteFamily={() => Promise.resolve({ success: true })}
      />,
    );
    const deleteButton = screen.queryByTestId("delete-family");
    expect(deleteButton).toBeNull();

    const associatedStudentsSection = screen.queryByText("Associated students");
    expect(associatedStudentsSection).toBeNull();

    const submitButton = screen.queryByRole("submit");
    expect(submitButton).toHaveTextContent("Add");
  });

  it("Renders properly when prefilled with a family with no associated students", async () => {
    render(
      <FamilyPage
        updateOrCreateFamily={() => Promise.resolve({ success: true })}
        deleteFamily={() => Promise.resolve({ success: true })}
        family={{ ...mockFamily, students: [] }}
      />,
    );
    const associatedStudentsSection = screen.queryByText("Associated students");
    expect(associatedStudentsSection).not.toBeNull();

    expect(screen.getByTestId("input-familyName")).toHaveValue("Smith");
    expect(screen.getByTestId("input-parent1FirstName")).toHaveValue("John");
    expect(screen.getByTestId("input-parent1LastName")).toHaveValue("Smith");
    expect(screen.getByTestId("phone-input-parent1Phone")).toHaveValue("(555) 444-3333");
    expect(screen.getByTestId("input-parent2FirstName")).toHaveValue("Jane");
    expect(screen.getByTestId("input-parent2LastName")).toHaveValue("Smith");
    expect(screen.getByTestId("phone-input-parent2Phone")).toHaveValue("(777) 555-3333");
    expect(screen.getByTestId("textarea-notes")).toHaveValue("Some notes");
  });

  it("Renders properly when prefilled with a family with associated students", async () => {
    render(
      <FamilyPage
        updateOrCreateFamily={() => Promise.resolve({ success: true })}
        deleteFamily={() => Promise.resolve({ success: true })}
        family={mockFamily}
      />,
    );
    const associatedStudentsSection = screen.queryByText("Associated students");
    expect(associatedStudentsSection).not.toBeNull();

    const deleteButton = screen.getByTestId("delete-family");
    expect(deleteButton).not.toBeNull();
    expect(deleteButton).toBeDisabled();

    expect(screen.getByTestId("input-familyName")).toHaveValue("Smith");
    expect(screen.getByTestId("input-parent1FirstName")).toHaveValue("John");
    expect(screen.getByTestId("input-parent1LastName")).toHaveValue("Smith");
    expect(screen.getByTestId("phone-input-parent1Phone")).toHaveValue("(555) 444-3333");
    expect(screen.getByTestId("input-parent2FirstName")).toHaveValue("Jane");
    expect(screen.getByTestId("input-parent2LastName")).toHaveValue("Smith");
    expect(screen.getByTestId("phone-input-parent2Phone")).toHaveValue("(777) 555-3333");
    expect(screen.getByTestId("textarea-notes")).toHaveValue("Some notes");

    const studentLink = screen.getByTestId("family-student-s1");
    expect(studentLink).not.toBeNull();
    expect(studentLink.closest("a")).toHaveAttribute("href", "/app/students/s1");
  });

  it("Submits proper data when creating a new family", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ success: true }));
    render(<FamilyPage updateOrCreateFamily={mockSubmit} />);

    fireEvent.change(screen.getByTestId("input-familyName"), { target: { value: "Chunderson" } });
    fireEvent.change(screen.getByTestId("input-parent1FirstName"), { target: { value: "Wanko" } });
    fireEvent.change(screen.getByTestId("input-parent1LastName"), { target: { value: "Latusius" } });
    fireEvent.change(screen.getByTestId("phone-input-parent1Phone"), { target: { value: "2223334444" } });
    fireEvent.change(screen.getByTestId("input-parent2FirstName"), { target: { value: "Shadankly" } });
    fireEvent.change(screen.getByTestId("input-parent2LastName"), { target: { value: "Gurple" } });
    fireEvent.change(screen.getByTestId("phone-input-parent2Phone"), { target: { value: "5556667777" } });
    fireEvent.change(screen.getByTestId("textarea-notes"), { target: { value: "A fine family" } });

    const submitButton = screen.getByRole("submit");
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());

    expect(mockSubmit).toHaveBeenCalledWith(
      {
        familyName: "Chunderson",
        notes: "A fine family",
        parent1FirstName: "Wanko",
        parent1LastName: "Latusius",
        parent1Phone: "+12223334444",
        parent2FirstName: "Shadankly",
        parent2LastName: "Gurple",
        parent2Phone: "+15556667777",
      },
      undefined,
    );
  });

  it("Submits proper data when editing a new family", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ success: true }));
    render(
      <FamilyPage
        updateOrCreateFamily={mockSubmit}
        deleteFamily={() => Promise.resolve({ success: true })}
        family={{ ...mockFamily, students: [] }}
      />,
    );

    fireEvent.change(screen.getByTestId("input-familyName"), { target: { value: "Chunderson" } });
    fireEvent.change(screen.getByTestId("input-parent1LastName"), { target: { value: "Latusius" } });
    fireEvent.change(screen.getByTestId("phone-input-parent1Phone"), { target: { value: "2223334444" } });
    fireEvent.change(screen.getByTestId("input-parent2FirstName"), { target: { value: "Shadankly" } });
    fireEvent.change(screen.getByTestId("textarea-notes"), { target: { value: "A fine family" } });

    const submitButton = screen.getByRole("submit");
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());

    expect(mockSubmit).toHaveBeenCalledWith(
      {
        familyName: "Chunderson",
        notes: "A fine family",
        parent1FirstName: "John",
        parent1LastName: "Latusius",
        parent1Phone: "+12223334444",
        parent2FirstName: "Shadankly",
        parent2LastName: "Smith",
        parent2Phone: "+17775553333",
      },
      "f1",
    );
  });

  it("Submits the same exact data when editing a new family but not making any changes", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ success: true }));
    const resubmittedForm = render(
      <FamilyPage
        updateOrCreateFamily={mockSubmit}
        deleteFamily={() => Promise.resolve({ success: true })}
        family={{ ...mockFamily, students: [] }}
      />,
    );

    const submitButton = screen.getByRole("submit");
    (submitButton as any).disabled = false;
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    (submitButton as any).disabled = true;
    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());

    expect(mockSubmit).toHaveBeenCalledWith(
      {
        familyName: "Smith",
        notes: "Some notes",
        parent1FirstName: "John",
        parent1LastName: "Smith",
        parent1Phone: "+15554443333",
        parent2FirstName: "Jane",
        parent2LastName: "Smith",
        parent2Phone: "+17775553333",
      },
      "f1",
    );

    const newForm = render(
      <FamilyPage
        updateOrCreateFamily={mockSubmit}
        deleteFamily={() => Promise.resolve({ success: true })}
        family={{ ...mockFamily, students: [] }}
      />,
    );

    expect(resubmittedForm.container).toEqual(newForm.container);
  });

  it("Does not submit without required data", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ success: true }));
    render(<FamilyPage updateOrCreateFamily={mockSubmit} />);

    const submitButton = screen.getByRole("submit");
    fireEvent.click(submitButton);
    expect(mockSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByTestId("input-familyName"), { target: { value: "Chunderson" } });
    fireEvent.click(submitButton);
    expect(mockSubmit).not.toHaveBeenCalled();

    const requiredFields = [
      ["input-familyName", "Bruce"],
      ["input-parent1FirstName", "Goose"],
      ["input-parent1LastName", "Spruce"],
    ];

    for (const field of requiredFields) {
      fireEvent.click(submitButton);
      expect(mockSubmit).not.toHaveBeenCalled();
      fireEvent.change(screen.getByTestId(field[0]), { target: { value: field[1] } });
    }
    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());
    expect(mockSubmit).toHaveBeenCalled();
  });

  it("Should fill in parent 1 and 2's last names based on family name unless those fields are dirty, and submits data as expected", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ success: true }));
    render(<FamilyPage updateOrCreateFamily={mockSubmit} />);

    fireEvent.change(screen.getByTestId("input-familyName"), { target: { value: "Chunderson" } });
    expect(screen.getByTestId("input-parent1LastName")).toHaveValue("Chunderson");
    expect(screen.getByTestId("input-parent2LastName")).toHaveValue("Chunderson");

    fireEvent.change(screen.getByTestId("input-parent1LastName"), { target: { value: "Bumphrey" } });
    fireEvent.change(screen.getByTestId("input-familyName"), { target: { value: "Grunky" } });
    expect(screen.getByTestId("input-parent1LastName")).toHaveValue("Bumphrey");
    expect(screen.getByTestId("input-parent2LastName")).toHaveValue("Grunky");

    fireEvent.change(screen.getByTestId("input-parent1LastName"), { target: { value: "Cloom" } });
    fireEvent.change(screen.getByTestId("input-parent2LastName"), { target: { value: "Broom" } });
    fireEvent.change(screen.getByTestId("input-familyName"), { target: { value: "Spencil" } });
    expect(screen.getByTestId("input-parent1LastName")).toHaveValue("Cloom");
    expect(screen.getByTestId("input-parent2LastName")).toHaveValue("Broom");

    fireEvent.change(screen.getByTestId("input-parent1FirstName"), { target: { value: "Barry" } });
    fireEvent.change(screen.getByTestId("phone-input-parent1Phone"), { target: { value: "+13334442222" } });
    fireEvent.change(screen.getByTestId("input-parent2FirstName"), { target: { value: "Glarry" } });
    fireEvent.change(screen.getByTestId("phone-input-parent2Phone"), { target: { value: "+8889994444" } });

    const submitButton = screen.getByRole("submit");
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());

    expect(mockSubmit).toHaveBeenCalledWith(
      {
        familyName: "Spencil",
        notes: "",
        parent1FirstName: "Barry",
        parent1LastName: "Cloom",
        parent1Phone: "+13334442222",
        parent2FirstName: "Glarry",
        parent2LastName: "Broom",
        parent2Phone: "+18889994444",
      },
      undefined,
    );
  });
});
