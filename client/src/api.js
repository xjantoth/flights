const base = () =>
  process.env.NODE_ENV === "development"
    ? "http://scaleway.linuxinuse.com"
    : // "http://localhost:5000"
      "";

export default {
  LOGIN: `${base()}/login`,
  RECOVERY: `${base()}/recovery`,
  DAYS_LIST: `${base()}/api/allud`,
  DAY: `${base()}/api/detail/`,
  ROTATION: `${base()}/api/route/`
};
