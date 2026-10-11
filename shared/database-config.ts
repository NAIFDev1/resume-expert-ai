// Shared by the application, session store, and schema setup.
export function getDatabaseConfig() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is required");
  const url = new URL(uri);
  const ca = process.env.DATABASE_SSL_CA?.replace(/\\n/g, "\n");
  const requiresTls = url.hostname.endsWith(".aivencloud.com") ||
    Boolean(ca) || url.searchParams.get("ssl-mode") === "REQUIRED";
  if (url.hostname.endsWith(".aivencloud.com") && !ca) {
    throw new Error("DATABASE_SSL_CA is required for Aiven. Copy the CA certificate from Aiven into this environment variable.");
  }
  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    ...(requiresTls ? { ssl: { rejectUnauthorized: true, ...(ca ? { ca } : {}) } } : {}),
  };
}
