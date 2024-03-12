import { createFormDataFromObject, stringToBoolean } from "@/util/formdata";

describe("createFormDataFromObject", () => {
  it("should create a FormData object from an object", () => {
    const obj = { a: 1, b: "banana", c: 3 };
    const formData = createFormDataFromObject(obj);
    expect(formData.get("a")).toBe("1");
    expect(formData.get("b")).toBe("banana");
    expect(formData.get("c")).toBe("3");
  });
});

describe("stringToBoolean", () => {
  it('should return true when given "true"', () => {
    expect(stringToBoolean("true")).toBe(true);
  });

  it('should return false when given "false"', () => {
    expect(stringToBoolean("false")).toBe(false);
  });

  it('should return false when given "banana"', () => {
    expect(stringToBoolean("banana")).toBe(false);
  });
});
