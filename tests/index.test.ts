import { describe, expect, it } from "vitest";
import { deleteTaskCache, useTask } from "../src";
const sleep = (ms: number) => () =>
  new Promise<"done">((resolve) => setTimeout(() => resolve("done"), ms));

const task = sleep(50);

describe("useTask", () => {
  it("should throw promise on first useTask", () => {
    try {
      useTask({ task, id: "a" });
    } catch (error) {
      expect(error instanceof Promise).toBe(true);
    }
  });

  it("should return done after first useTask promise resolved", async () => {
    try {
      useTask({ task, id: "a" });
    } catch (error) {}

    await sleep(100)();
    const result = useTask({ task, id: "a" });
    expect(result).toBe("done");
  });

  it("should throw promise after task cache deleted", async () => {
    try {
      useTask({ task, id: "a" });
    } catch (error) {}

    await sleep(100)();
    deleteTaskCache("a");

    try {
      useTask({ task, id: "a" });
    } catch (error) {
      expect(error instanceof Promise).toBe(true);
    }
  });
});
