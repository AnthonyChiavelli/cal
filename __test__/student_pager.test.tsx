import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StudentPager from "../src/app/components/student_pager";


let pageNumber = 0;
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  useSearchParams() {
    return {
      get(name: string) {
        if (name === "page") return pageNumber;
      },
      has(name: string) {
        if (name === "page") return true;
      },
    };
  },
  usePathname() {
    return {};
  },
}));

describe("StudentPager", () => {
  it("Paginates correctly with page 7, totalCount 153, and pageSize 10", async () => {
    pageNumber = 7;
    const container = render(<StudentPager totalCount={153} pageSize={10} />);
    ["5", "6", "7", "8", "9"].forEach((pageNumber: string) => {
      const currentPageButton = screen.queryByText(pageNumber, {selector: '.page-number > span'});
      expect(currentPageButton).toBeInTheDocument();
    });
    ["1", "2", "10", "11", "12"].forEach((pageNumber: string) => {
      const currentPageButton = screen.queryByText(pageNumber, {selector: '.page-number > span'});
      expect(currentPageButton).not.toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });

  it("Paginates correctly with page 1, totalCount 153, and pageSize 10", async () => {
    pageNumber = 1;
    const container = render(<StudentPager totalCount={153} pageSize={10} />);
    ["1", "2", "3", "4", "5"].forEach((pageNumber: string) => {
      const currentPageButton = screen.queryByText(pageNumber, {selector: '.page-number > span'});
      expect(currentPageButton).toBeInTheDocument();
    });
    ["6", "7", "0", "8", "9"].forEach((pageNumber: string) => {
      const currentPageButton = screen.queryByText(pageNumber, {selector: '.page-number > span'});
      expect(currentPageButton).not.toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });

  it("Paginates correctly with page 9, totalCount 101, and pageSize 10", async () => {
    pageNumber = 9;
    const container = render(<StudentPager totalCount={101} pageSize={10} />);
    ["9", "8", "9", "10", "11"].forEach((pageNumber: string) => {
      const currentPageButton = screen.queryByText(pageNumber, {selector: '.page-number > span'});
      expect(currentPageButton).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });

  it("Paginates correctly with page 9, totalCount 100, and pageSize 10", async () => {
    pageNumber = 9;
    const container = render(<StudentPager totalCount={100} pageSize={10} />);
    ["7", "9", "8", "9", "10"].forEach((pageNumber: string) => {
      const currentPageButton = screen.queryByText(pageNumber, {selector: '.page-number > span'});
      expect(currentPageButton).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });

  it("Paginates correctly with page 1, totalCount 1, and pageSize 10", async () => {
    pageNumber = 1;
    const container = render(<StudentPager totalCount={1} pageSize={10} />);
    ["1"].forEach((pageNumber: string) => {
      const currentPageButton = screen.queryByText(pageNumber, {selector: '.page-number > span'});
      expect(currentPageButton).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });
});
