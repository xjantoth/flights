const ACCESS_TOKEN = "_2w_at";
const REFRESH_TOKEN = "_2w_rt";

const auth = {
  get isAuthenticated() {
    return auth.tokens.access && auth.tokens.refresh;
  },
  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    delete localStorage.ACCESS_TOKEN;
    localStorage.removeItem(REFRESH_TOKEN);
    delete localStorage.REFRESH_TOKEN;
  },
  tokens: {
    get access() {
      return localStorage.getItem(ACCESS_TOKEN);
    },
    set access(value) {
      localStorage.setItem(ACCESS_TOKEN, value);
    },
    get refresh() {
      return localStorage.getItem(REFRESH_TOKEN);
    },
    set refresh(value) {
      localStorage.setItem(REFRESH_TOKEN, value);
    }
  }
};

export default auth;
