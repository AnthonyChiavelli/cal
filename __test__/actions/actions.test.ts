/**
 * @jest-environment node
 */
import "../../src/singleton";
import * as AllActions from "@/app/actions";
import { getSessionOrFail } from "@/app/actions/util";

jest.mock("../../src/app/actions/util");
jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test@examples.com" }, session: {} })),
}));

const authGuardBlackList = ["getSessionOrFail"];

/**
 *
 * Dynamically imports all server actions and runs tests on them. Perhaps there is a better way...
 *
 **/
describe("server actions", () => {
  it("should be auth-guarded", async () => {
    const testableActions = Object.values(AllActions).filter((action) => !authGuardBlackList.includes(action.name));
    // @ts-ignore
    getSessionOrFail.mockClear();
    testableActions.forEach(async (action) => {
      // @ts-ignore
      getSessionOrFail.mockRejectedValueOnce(new Error("Not authenticated"));
      // @ts-ignore
      expect(async () => await action({ id: 1 } as any as Event)).rejects.toThrow("Not authenticated");
      expect(getSessionOrFail).toHaveBeenCalledTimes(1);
      // @ts-ignore
      getSessionOrFail.mockClear();
    });
  });
});
