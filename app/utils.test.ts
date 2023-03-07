import { beforeEach, describe, expect, it, vi } from "vitest";
import { secondsUntilNextRebuild } from "~/utils";

const NOW = new Date("2023-03-07T17:15:53.673-06:00");
const MS_IN_SECONDS = 1000;

function addSecondsToDate(date: Date, seconds: number) {
  const truncateMs = new Date(new Date(date.getTime()).setUTCMilliseconds(0));
  return new Date(truncateMs.getTime() + seconds * MS_IN_SECONDS);
}

describe("utils", () => {
  beforeEach(() => {
    vi.setSystemTime(NOW);
  });

  describe("secondsUntilNextRebuild", () => {
    it("should calculate next rebuild when given a date", () => {
      const date = new Date("2023-01-01T00:00:00.000Z");
      const secondsUntilFourTheNextDay = secondsUntilNextRebuild(
        date.getTime()
      );
      const expectedDate = new Date("2023-01-02T10:00:00.000Z");
      expect(addSecondsToDate(date, secondsUntilFourTheNextDay)).toEqual(
        expectedDate
      );
    });

    it("should calculate next rebuild from now", () => {
      const secondsUntilFourTheNextDay = secondsUntilNextRebuild();
      const expectedDate = new Date("2023-03-08T10:00:00.000Z");
      expect(addSecondsToDate(NOW, secondsUntilFourTheNextDay)).toEqual(
        expectedDate
      );
    });
  });
});
