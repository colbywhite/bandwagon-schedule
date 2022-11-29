import invariant from "tiny-invariant";
import * as supabase from "@supabase/supabase-js";
import { DateTime } from "luxon";
import { StorageError, StorageUnknownError } from "@supabase/storage-js";
import { today } from "~/utils";

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

export async function createBucket() {
  invariant(SUPABASE_URL, "Missing SUPABASE_URL env var.");
  invariant(SUPABASE_KEY, "Missing SUPABASE_KEY env var.");
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const { storage } = client;
  // if the bucket exists this silently fails, so no need to catch anythi.
  await storage.createBucket(BUCKET_ID, { public: false });
  // const { error } = await cache.createBucket(BUCKET_ID, { public: false });
  // (await isDuplicateBucketError(error))
  //   ? console.log(`Bucket ${BUCKET_ID} already exists.`)
  //   : console.log(`Created bucket ${BUCKET_ID}.`);
  return storage.from(BUCKET_ID);
}

export async function saveToStorage<T>(name: string, data: T) {
  const bucket = await createBucket();
  const key = `${name}-${today().toISODate()}`;
  await bucket.upload(key, JSON.stringify(data), {
    contentType: "application/json",
    upsert: true,
  });
  console.log("Saved", key);
  return data;
}

export async function retrieveFromStorage<T>(
  name: string,
  date: DateTime = today()
): Promise<T> {
  const bucket = await createBucket();
  const key = `${name}-${date.toISODate()}`;
  const { data } = await bucket.download(key);
  if (data === null) {
    throw new Error(`Could not retrieve ${key} from ${BUCKET_ID}`);
  }
  const cachedBody = await data.text();
  return JSON.parse(cachedBody) as T;
}
