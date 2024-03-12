import { shallowCompareArrays } from "../../src/util/array";
import "@testing-library/jest-dom";

describe("shallowCompareArrays", () => {
  it.each([
    // Exact matches
    [[], [], true],
    [[1, 2, 3], [1, 2, 3], true],
    [[1.7, 2.7, 3.7], [1.7, 2.7, 3.7], true],
    [[1, 2, "3"], [1, 2, "3"], true],
    [["banana", "mango"], ["banana", "mango"], true],
    [[false, "mango"], [false, "mango"], true],
    [[213049823042183049, 239843874293847234], [213049823042183049, 239843874293847234], true],
    [[true, false, true], [true, false, true], true],
    [[null, 7, undefined], [null, 7, undefined], true],
    // Total non-matches
    [[], [1, 2, 3], false],
    [[1, 2, 3], [], false],
    [[false], [true], false],
    [[1, 2, 3.444444], [1, 2, 3.444445], false],
    // Shuffled non-matches
    [[1, 2, 3], [3, 2, 1], false],
    [["apple", "mango", "peach"], ["peach", "mango", "apple"], false],
    [[false, true], [true, false], false],
    [[1.7, 2.7, 3.7], [1.7, 3.7, 2.7], false],
    [[239843874293847234, 213049823042183049], [213049823042183049, 239843874293847234], false],
  ])("Compares 2 arrays correctly with order important", (arr1, arr2, expected) => {
    expect(shallowCompareArrays(arr1, arr2, true)).toBe(expected);
  });

  it.each([
    // Exact matches
    [[], [], true],
    [[1, 2, 3], [1, 2, 3], true],
    [[1.7, 2.7, 3.7], [1.7, 2.7, 3.7], true],
    [[1, 2, "3"], [1, 2, "3"], true],
    [["banana", "mango"], ["banana", "mango"], true],
    [[false, "mango"], [false, "mango"], true],
    [[213049823042183049, 239843874293847234], [213049823042183049, 239843874293847234], true],
    [[true, false, true], [true, false, true], true],
    [[null, 7, undefined], [null, 7, undefined], true],
    // Total non-matches
    [[], [1, 2, 3], false],
    [[1, 2, 3], [], false],
    [[false], [true], false],
    [[1, 2, 3.444444], [1, 2, 3.444445], false],
    // Shuffled matches
    [[1, 2, 3], [3, 2, 1], true],
    [["apple", "mango", "peach"], ["peach", "mango", "apple"], true],
    [[false, true], [true, false], true],
    [[1.7, 2.7, 3.7], [1.7, 3.7, 2.7], true],
    [[239843874293847234, 213049823042183049], [213049823042183049, 239843874293847234], true],
  ])("Compares 2 arrays correctly with order not important", (arr1, arr2, expected) => {
    expect(shallowCompareArrays(arr1, arr2, false)).toBe(expected);
  });
});
