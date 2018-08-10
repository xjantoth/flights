const base =
  process.env.NODE_ENV === "development"
    ? "http://scaleway.linuxinuse.com/api"
    : "";

export default {
  LOGIN: `${base}/login`,
  RECOVERY: `${base}/recovery`
};
