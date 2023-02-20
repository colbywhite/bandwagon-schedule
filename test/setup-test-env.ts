import { installGlobals } from "@remix-run/node";
import { afterEach, beforeEach, vi } from "vitest";

installGlobals();

beforeEach(() => {
  vi.mock("@supabase/supabase-js");
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});
