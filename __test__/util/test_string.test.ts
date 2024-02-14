import "@testing-library/jest-dom";
import { pluralize } from "../../src/util/string";

describe("pluralize", () => {
  it.each([
    ['cat', 1, false, undefined, 'cat'],
    ['cat', 0, false, undefined, 'cats'],
    ['cat', 2, false, undefined, 'cats'],
    ['cat', 99, false, undefined, 'cats'],
    ['cat', -5, false, undefined, 'cats'],
    
    ['cat', 1, true, undefined, '1 cat'],
    ['cat', 0, true, undefined, '0 cats'],
    ['cat', 2, true, undefined, '2 cats'],
    ['cat', 99, true, undefined, '99 cats'],
    ['cat', -5, true, undefined, '-5 cats'],
    
    ['ox', 1, false, 'oxen', 'ox'],
    ['ox', 0, false, 'oxen', 'oxen'],
    ['ox', 2, false, 'oxen', 'oxen'],
    ['ox', 99, false, 'oxen', 'oxen'],
    ['ox', -5, false, 'oxen', 'oxen'],
    
    ['ox', 1, true, 'oxen', '1 ox'],
    ['ox', 0, true, 'oxen', '0 oxen'],
    ['ox', 2, true, 'oxen', '2 oxen'],
    ['ox', 99, true, 'oxen', '99 oxen'],
    ['ox', -5, true, 'oxen', '-5 oxen'],

  ])("Pluralizes words correctly", (word, count, includeNumber, irregularPlural, expected) => {
    expect(pluralize(word, count, includeNumber, irregularPlural)).toBe(expected)
  })
});
