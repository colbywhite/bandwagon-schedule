import { beforeEach, describe, expect, it, vi } from "vitest";
import { retrieveFromStorage, saveToStorage } from "~/cache";

describe("cache", () => {
  beforeEach(() => {
    const date = new Date(2000, 0, 2, 13);
    vi.setSystemTime(date);
  });

  it("should save JSON", async () => {
    const supabase = await import("@supabase/supabase-js");
    await saveToStorage("foo", { bar: "baz" });
    const bucket = expectBucketCreated(supabase, "third-party-requests");
    expect(bucket.upload).toHaveBeenCalledOnce();
    expect(bucket.upload).toHaveBeenCalledWith(
      "foo-2000-01-02",
      '{"bar":"baz"}',
      {
        contentType: "application/json",
        upsert: true,
      }
    );
  });

  it("should retrieve JSON", async () => {
    const supabase = await import("@supabase/supabase-js");
    const data = await retrieveFromStorage("foo");
    const bucket = expectBucketCreated(supabase, "third-party-requests");
    expect(bucket.download).toHaveBeenCalledOnce();
    expect(bucket.download).toHaveBeenCalledWith("foo-2000-01-02");
    expect(data).toEqual({ bar: "baz" });
  });
});

// TODO make custom matcher
function expectBucketCreated(supabase: any, bucketId: string) {
  expect(supabase.createClient).toHaveBeenCalledOnce();
  expect(supabase.createClient).toHaveBeenCalledWith(
    "https://thisisatest.supabase.co",
    "VITE_SUPABASE_KEY"
  );
  const client = supabase.createClient.results[0][1];
  expect(client.storage.createBucket).toHaveBeenCalledOnce();
  expect(client.storage.createBucket).toHaveBeenCalledWith(bucketId, {
    public: false,
  });
  expect(client.storage.from).toHaveBeenCalledOnce();
  expect(client.storage.from).toHaveBeenCalledWith(bucketId);
  return client.storage.from.results[0][1];
}
