import { installGlobals } from "@remix-run/node";
import { beforeEach, vi } from "vitest";

installGlobals();

const mockStorage = {
  createBucket: () => Promise.resolve(),
  from: () => ({
    download: () => Promise.resolve({ data: null }),
    upload: () => Promise.resolve({ data: null }),
  }),
};

beforeEach(() => {
  vi.mock("@supabase/supabase-js", () => ({
    createClient: () => ({ storage: mockStorage }),
  }));
});
