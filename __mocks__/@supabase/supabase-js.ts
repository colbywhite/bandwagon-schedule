import { vi } from "vitest";

export const createClient = vi.fn().mockReturnValue({
  storage: {
    createBucket: vi.fn().mockResolvedValue("done"),
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue("done"),
      download: vi.fn(() =>
        Promise.resolve({
          data: {
            text: () => Promise.resolve('{"bar":"baz"}'),
          },
        })
      ),
    }),
  },
});
