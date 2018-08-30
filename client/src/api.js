import axios from "axios";
import auth from "services/auth";

const base = () =>
  process.env.NODE_ENV === "development"
    ? "https://scaleway.linuxinuse.com"
    : "";

const Client = axios.create();

const api = {
  Client,
  LOGIN: `${base()}/api/login`,
  REFRESH: `${base()}/api/refresh`,
  RECOVERY: `${base()}/recovery`,
  DAYS_LIST: `${base()}/api/allud`,
  DAY: `${base()}/api/detail/`,
  ROTATION: `${base()}/api/route/`
};

// Register request
Client.interceptors.request.use(
  function(config) {
    let token = null;
    if (config.url.match(api.REFRESH)) {
      token = auth.tokens.refresh;
    }
    if (!config.url.match(api.LOGIN)) {
      token = auth.tokens.access;
    }
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

Client.interceptors.response.use(
  function(response) {
    if (
      response.request.responseURL.match(api.LOGIN) ||
      response.request.responseURL.match(api.REFRESH)
    ) {
      auth.tokens.access = response.data.access_token;
      auth.tokens.refresh = response.data.refresh_token;
    }
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default api;
