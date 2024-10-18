import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AreasOfNeedPage from "@/app/components/areas_of_need_page";

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

// Monkeypatch
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const mockAreasOfNeed = [
  {
    id: "1",
    createdAt: new Date("2021-02-02"),
    updatedAt: new Date("2021-02-02"),
    name: "Charcuterie",
  },
  {
    id: "2",
    createdAt: new Date("2021-04-04"),
    updatedAt: new Date("2021-03-03"),
    name: "Ham Slicing",
  },
];

describe("AreasOfNeedPage", () => {
  it("Renders a consistent snapshot when empty", async () => {
    const container = render(<AreasOfNeedPage areasOfNeed={[]} />);
    expect(container).toMatchSnapshot();
  });

  it("Renders a consistent snapshot when filled with data", async () => {
    const container = render(<AreasOfNeedPage areasOfNeed={mockAreasOfNeed} />);
    expect(container).toMatchSnapshot();
  });

  it("Renders correctly when empty", async () => {
    render(<AreasOfNeedPage areasOfNeed={[]} />);

    expect(screen.getByText("No areas of need yet!")).toBeInTheDocument();
  });

  it("Renders correctly when filled with data", async () => {
    render(<AreasOfNeedPage areasOfNeed={mockAreasOfNeed} />);
    expect(screen.queryByText("No areas of need yet!")).toBeNull();
    for (const area of mockAreasOfNeed) {
      expect(screen.getByText(area.name)).toBeInTheDocument();
      expect(screen.getByText(area.createdAt.toLocaleString())).toBeInTheDocument();
    }
  });

  it("Should show a deletion modal on delete and call the delete method on confirm", async () => {
    const mockDelete = jest.fn();
    render(<AreasOfNeedPage areasOfNeed={mockAreasOfNeed} deleteAreaOfNeed={mockDelete} />);
    window.ResizeObserver = ResizeObserver;

    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(screen.getByText("Are you sure you want to delete 'Charcuterie'?")).toBeInTheDocument();
    fireEvent.click(screen.getAllByText("Okay")[0]);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith("1");
  });
});

describe("AddAreaOfNeedModal", () => {
  it("Show and properly handle input", async () => {
    const mockOnCreate = jest.fn();
    render(<AreasOfNeedPage areasOfNeed={mockAreasOfNeed} updateOrCreateAreaOfNeed={mockOnCreate} />);

    // Not implemented in jest, need to monkeypatch
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
    fireEvent.click(screen.getByText("Add Area of Need"));

    expect(screen.getByText("Create new 'Area of need'")).toBeInTheDocument();
    expect(screen.getByTestId("area-of-need-name")).toBeInTheDocument();

    expect(screen.getByText("Create")).toBeDisabled();
    fireEvent.change(screen.getByTestId("area-of-need-name"), { target: { value: "Test" } });
    expect(screen.getByText("Create")).not.toBeDisabled();

    fireEvent.click(screen.getByText("Create"));
    expect(mockOnCreate).toHaveBeenCalledTimes(1);
    expect(mockOnCreate).toHaveBeenCalledWith("Test");
  });

  it("Blocks creation of duplicate-named entity, with case-insensivity", async () => {
    render(<AreasOfNeedPage areasOfNeed={mockAreasOfNeed} />);

    // Not implemented in jest, need to monkeypatch
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
    fireEvent.click(screen.getByText("Add Area of Need"));

    expect(screen.getByText("Create new 'Area of need'")).toBeInTheDocument();
    expect(screen.getByTestId("area-of-need-name")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("area-of-need-name"), { target: { value: "Charcuterie" } });
    expect(screen.getByText("Create")).toBeDisabled();

    fireEvent.change(screen.getByTestId("area-of-need-name"), { target: { value: "chArcuTerIe" } });
    expect(screen.getByText("Create")).toBeDisabled();
  });
});
