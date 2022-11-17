import invariant from "tiny-invariant";
import * as supabase from "@supabase/supabase-js";
import { DateTime } from "luxon";
import { StorageError, StorageUnknownError } from "@supabase/storage-js";

const BUCKET_ID = "third-party-requests";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;
invariant(SUPABASE_URL, "Missing SUPABASE_URL env var.");
invariant(SUPABASE_KEY, "Missing SUPABASE_KEY env var.");

async function isDuplicateBucketError(err: StorageError | null) {
  const isUnknownError = err !== null && err.name === "StorageUnknownError";
  if (!isUnknownError) {
    return false;
  }
  const { originalError } = err as StorageUnknownError;
  try {
    const maybeResponse = originalError as Response;
    const { statusCode } = await maybeResponse.json();
    return statusCode === "23505";
  } catch (e) {
    return false;
  }
}

async function createCache() {
  invariant(SUPABASE_URL, "Missing SUPABASE_URL env var.");
  invariant(SUPABASE_KEY, "Missing SUPABASE_KEY env var.");
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const { storage: cache } = client;
  // if the bucket exists this silently fails, so no need to catch anythi.
  await cache.createBucket(BUCKET_ID, { public: false });
  // const { error } = await cache.createBucket(BUCKET_ID, { public: false });
  // (await isDuplicateBucketError(error))
  //   ? console.log(`Bucket ${BUCKET_ID} already exists.`)
  //   : console.log(`Created bucket ${BUCKET_ID}.`);
  return cache;
}

function today() {
  return DateTime.now().setZone("America/New_York").startOf("day");
}

export function cacheWrappedRequest<Args extends any[], Return extends any>(
  name: string,
  func: (...args: Args) => Promise<Return>
) {
  return async (...args: Args) => {
    const cache = await createCache();
    const key = `${name}-${today().toISODate()}`;
    const { data: cacheHit } = await cache.from(BUCKET_ID).download(key);
    if (cacheHit === null) {
      // console.log("Cache miss for", key);
      const result = await func(...args);
      await cache.from(BUCKET_ID).upload(key, JSON.stringify(result), {
        contentType: "application/json",
      });
      return result;
    }
    // console.log("Cache hit for", key);
    const cachedBody = await cacheHit.text();
    return JSON.parse(cachedBody) as Return;
  };
}
