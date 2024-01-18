export default function ensureError(err: unknown): Error {
  if (err instanceof Error) return err
  let stringified: string = "[unable to stringify error]";
  try {
    stringified = JSON.stringify(err);
  } catch { }
  const error = new Error(stringified);
  return error;
}

