import React from "react";
import { fireEvent, getByText, render, screen, waitFor } from "@testing-library/react";
import selectEvent from "react-select-event";
import "@testing-library/jest-dom";
import StudentPage from "@/app/components/student_page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: () => null,
    };
  },
  usePathname() {
    return {};
  },
}));

const mockAreasOfNeed = [
  {
    id: "1",
    name: "Arithmetical Arts",
  },
  {
    id: "2",
    name: "Wizardry",
  },
  {
    id: "1",
    name: "Brocial Studies",
  },
];

const mockStudent = {
  id: "s1",
  createdAt: new Date("10/09/1990"),
  updatedAt: new Date("10/09/1990"),
  ownerId: "test@test.com",
  firstName: "Crumble",
  lastName: "Ducacis",
  family: {
    id: "family1",
    familyName: "Fooft",
    notes: "safs",
    balance: "0",
  },
  areaOfNeed: [
    {
      id: "areaOfNeed1",
      name: "Mathicals",
    },
    {
      id: "areaOfNeed2",
      name: "Astronomy",
    },
  ],
  gradeLevel: 1,
  notes: "",
};

const mockStudentWithEmptyFamilyandAreasOfNeed = {
  ...mockStudent,
  family: null,
  areaOfNeed: [],
};

const mockFamilies = [
  {
    id: "1",
    familyName: "Droofus",
  },
  {
    id: "2",
    familyName: "Pantuflus",
  },
  {
    id: "3",
    familyName: "Ratskin",
  },
];

describe("StudentPage", () => {
  it("Renders a consistent snapshot when empty", async () => {
    const container = render(
      <StudentPage
        updateOrCreateStudent={() => Promise.resolve({ success: true })}
        areasOfNeed={mockAreasOfNeed}
        families={mockFamilies}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("Renders a consistent snapshot when prefilled with data", async () => {
    const container = render(
      <StudentPage
        updateOrCreateFamily={() => Promise.resolve({ success: true })}
        families={mockFamilies}
        areasOfNeed={mockAreasOfNeed}
        student={mockStudent}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("Renders correctly when prefilled with data", async () => {
    const container = render(
      <StudentPage
        updateOrCreateFamily={() => Promise.resolve({ success: true })}
        families={mockFamilies}
        areasOfNeed={mockAreasOfNeed}
        student={mockStudent}
      />,
    );

    expect(container.getByRole("form")).toHaveFormValues({ family: "family1" });
  });

  it("Renders without any families or areas of need present", async () => {
    const container = render(
      <StudentPage updateOrCreateFamily={() => Promise.resolve({ success: true })} families={[]} areasOfNeed={[]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("Submits proper data when creating a new student", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ success: true }));
    const container = render(
      <StudentPage updateOrCreateStudent={mockSubmit} families={mockFamilies} areasOfNeed={mockAreasOfNeed} />,
    );

    fireEvent.change(screen.getByTestId("input-firstName"), { target: { value: "Chunderson" } });
    fireEvent.change(screen.getByTestId("input-lastName"), { target: { value: "Wanko" } });
    fireEvent.change(screen.getByTestId("input-gradeLevel"), { target: { value: "12" } });
    fireEvent.change(screen.getByTestId("textarea-notes"), { target: { value: "A fine student" } });

    await selectEvent.select(container.getByLabelText("family"), "Droofus");
    await selectEvent.select(container.getByLabelText("areasOfNeed"), "Wizardry");

    const submitButton = screen.getByRole("submit");
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());

    expect(mockSubmit).toHaveBeenCalledWith(
      {
        areasOfNeed: [
          {
            label: "Wizardry",
            value: "2",
          },
        ],
        family: {
          label: "Droofus",
          value: "1",
        },
        firstName: "Chunderson",
        gradeLevel: "12",
        lastName: "Wanko",
        notes: "A fine student",
      },
      undefined,
    );
  });

  it("Submits proper data when updating a student", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ success: true }));
    const container = render(
      <StudentPage
        updateOrCreateStudent={mockSubmit}
        families={mockFamilies}
        areasOfNeed={mockAreasOfNeed}
        student={mockStudentWithEmptyFamilyandAreasOfNeed}
      />,
    );

    fireEvent.change(screen.getByTestId("input-lastName"), { target: { value: "Wanko" } });
    fireEvent.change(screen.getByTestId("input-gradeLevel"), { target: { value: "12" } });

    await selectEvent.select(container.getByLabelText("family"), "Droofus");
    await selectEvent.select(container.getByLabelText("areasOfNeed"), "Wizardry");

    const submitButton = screen.getByRole("submit");
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());

    expect(mockSubmit).toHaveBeenCalledWith(
      {
        areasOfNeed: [
          {
            label: "Wizardry",
            value: "2",
          },
        ],
        family: {
          label: "Droofus",
          value: "1",
        },
        firstName: "Crumble",
        gradeLevel: "12",
        lastName: "Wanko",
        notes: "",
      },
      "s1",
    );
  });

  it("Submits the same exact data when editing a new student but not making any changes", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve({ success: true }));
    render(
      <StudentPage
        updateOrCreateStudent={mockSubmit}
        families={mockFamilies}
        areasOfNeed={mockAreasOfNeed}
        student={mockStudent}
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
        areasOfNeed: [
          {
            label: "Mathicals",
            value: "areaOfNeed1",
          },
          {
            label: "Astronomy",
            value: "areaOfNeed2",
          },
        ],
        family: {
          label: "Fooft",
          value: "family1",
        },
        firstName: "Crumble",
        lastName: "Ducacis",
        gradeLevel: 1,
        notes: "",
      },
      "s1",
    );

    // TODO proper check to acertain idempotency
  });
});
