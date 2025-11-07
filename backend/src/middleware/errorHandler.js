
export default function errorHandler(err, req, res, next) {
  console.error("[error handler]", err);
  const status = err?.status || err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";
  if (status === 400) {
    return res.status(400).json({ error: message });
  }

  return res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
}
