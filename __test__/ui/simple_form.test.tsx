import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SimpleForm from "../../src/app/components/simple_form";
import "@testing-library/jest-dom";

describe("SimpleForm", () => {
  it("Renders a consistent snapshot with various form element types", async () => {
    const container = render(
      <SimpleForm
        onSubmit={() => {}}
        formElements={[
          {
            title: "First Name",
            name: "firstName",
            type: "text",
            required: true,
          },
          {
            title: "Last Name",
            name: "lastName",
            type: "text",
            required: true,
          },
          {
            title: "Grade Level",
            name: "gradeLevel",
            type: "number",
            required: true,
            additionalProps: {
              min: 1,
            },
          },
          {
            title: "Areas of need",
            name: "areasOfNeed",
            type: "multiselectCreateable",
            additionalProps: {
              options: [
                { label: "Math", value: "math" },
                { label: "Reading", value: "reading" },
                { label: "Writing", value: "writing" },
                { label: "Behavior", value: "behavior" },
                { label: "Social Skills", value: "socialSkills" },
              ],
            },
          },
          {
            title: "Notes",
            name: "notes",
            type: "textarea",
          },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("Renders the correct form type for create mode", async () => {
    render(
      <SimpleForm
        onSubmit={() => {}}
        formElements={[
          {
            title: "First Name",
            name: "firstName",
            type: "text",
            required: true,
          },
        ]}
      />,
    );
    const submitButton = screen.getByRole("submit");
    expect(submitButton).toHaveTextContent("Add");
  });

  it("Renders the correct form type for create mode", async () => {
    render(
      <SimpleForm
        editMode
        onSubmit={() => {}}
        formElements={[
          {
            title: "First Name",
            name: "firstName",
            type: "text",
            required: true,
          },
        ]}
      />,
    );
    const submitButton = screen.getByRole("submit");
    expect(submitButton).toHaveTextContent("Update");
  });

  it("Disables the submit button in create mode when form is not dirty", async () => {
    render(
      <SimpleForm
        editMode
        onSubmit={() => {}}
        formElements={[
          {
            title: "First Name",
            name: "firstName",
            type: "text",
            required: true,
          },
        ]}
      />,
    );
    const submitButton = screen.getByRole("submit");
    expect(submitButton).toBeDisabled();

    const inputElement = screen.getByTestId("input-firstName");
    fireEvent.change(inputElement, { target: { value: "Frank" } });
    expect(submitButton).not.toBeDisabled();
  });

  it("Disables the submit button in edit mode when form is not dirty", async () => {
    render(
      <SimpleForm
        editMode
        initialValues={{ firstName: "Frank" }}
        onSubmit={() => {}}
        formElements={[
          {
            title: "First Name",
            name: "firstName",
            type: "text",
            required: true,
          },
        ]}
      />,
    );
    const submitButton = screen.getByRole("submit");
    expect(submitButton).toBeDisabled();

    const inputElement = screen.getByTestId("input-firstName");
    fireEvent.change(inputElement, { target: { value: "Franko" } });

    expect(submitButton).not.toBeDisabled();
    fireEvent.change(inputElement, { target: { value: "Frank" } });
    expect(submitButton).toBeDisabled();
  });
});
