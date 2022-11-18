import type { Handler } from "@netlify/functions";
import { schedule } from "@netlify/functions";

const update: Handler = async (event, context) => {
  console.log("Received event:", event);
  return { statusCode: 200 };
};

export const handler = schedule("*/10 * * * *", update);
