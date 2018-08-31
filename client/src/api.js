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
  LOGOUT: `${base()}/api/logout`,
  DAYS_LIST: `${base()}/api/allud`,
  DAY: `${base()}/api/detail/`,
  ROTATION: `${base()}/api/route/`
};

// Register request interceptor
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

// Register response interceptor
Client.interceptors.response.use(
  function(response) {
    const url = response.request.responseURL;
    const data = response.data;
    if (url.match(api.LOGIN) || url.match(api.REFRESH)) {
      auth.tokens.access = data.access_token;
      auth.tokens.refresh = data.refresh_token;
    } else if (response.status === 401) {
      Client.post(api.REFRESH)
        .then(response => {
          // TODO: this might not be necessary
          auth.tokens.access_token = data.access_token;
        })
        .catch(error => Promise.reject(error));
    }

    return response;
  },
  function(error) {
    // if (error.response.status === 401) {
    //   Client.post(api.REFRESH).then(data => {
    //     // TODO: this might not be necessary
    //     // auth.tokens.access_token = data.access_token;
    //   });
    // .catch(Promise.reject);
    // }
    return Promise.reject(error);
  }
);

export default api;
