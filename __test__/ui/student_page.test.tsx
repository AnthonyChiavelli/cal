import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentPage from "@/app/components/student_page";

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

const mockStudent = {
  id: "s1",
  createdAt: new Date("10/09/1990"),
  updatedAt: new Date("10/09/1990"),
  ownerId: "test@test.com",
  familyId: "f1",
  firstName: "Crumble",
  lastName: "Ducacis",
  gradeLevel: 1,
  notes: "",
};

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
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("Renders without any families or areas of need present", async () => {
    const container = render(
      <StudentPage updateOrCreateFamily={() => Promise.resolve({ success: true })} families={[]} areasOfNeed={[]} />,
    );
    expect(container).toMatchSnapshot();
  });
});
