const ACCESS_TOKEN = "_2w_at";
const REFRESH_TOKEN = "_2w_rt";

const auth = {
  get isAuthenticated() {
    return auth.tokens.access && auth.tokens.refresh;
  },
  logout() {
    sessionStorage.removeItem(ACCESS_TOKEN);
    delete sessionStorage.ACCESS_TOKEN;
    sessionStorage.removeItem(REFRESH_TOKEN);
    delete sessionStorage.REFRESH_TOKEN;
  },
  tokens: {
    get access() {
      return sessionStorage.getItem(ACCESS_TOKEN);
    },
    set access(value) {
      sessionStorage.setItem(ACCESS_TOKEN, value);
    },
    get refresh() {
      return sessionStorage.getItem(REFRESH_TOKEN);
    },
    set refresh(value) {
      sessionStorage.setItem(REFRESH_TOKEN, value);
    }
  }
};

export default auth;
