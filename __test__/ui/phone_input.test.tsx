import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import PhoneInput from "../../src/app/components/phone_input";
import "@testing-library/jest-dom";

jest.mock("react-hook-form");

describe("PhoneInput component", () => {
  const mockUseForm = useForm as jest.Mock;
  beforeEach(() => {
    mockUseForm.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      formState: { errors: {}, isDirty: true, isSubmitting: false, isValid: true },
      register: jest.fn(),
      watch: jest.fn(),
    }));
  });

  it("Renders a consistent snapshot", async () => {
    const container = render(<PhoneInput name="customerPhone" value="+17776664444" onChange={() => false} />);

    expect(container).toMatchSnapshot();
  });
});
