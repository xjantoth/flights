const base =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

export default {
  LOGIN: `${base}/login`,
  RECOVERY: `${base}/recovery`
};
