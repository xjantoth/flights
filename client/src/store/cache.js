/**
 * Check if cached record is valid.
 * @param {object} cachedValue - cache record
 * @param {number} cacheTime - time to cache
 * @returns {bool}
 */
const isCached = (cachedValue, cacheTime) =>
  (new Date() - cachedValue.at) / 1000 < cacheTime;

/**
 * Get cached value or false.
 * @param {object} store - store to use
 * @param {number} cacheTime - time to cache
 * @param {object} action - dispatched action
 * @returns {[bool, object]}
 */
const getFromCache = (store, cacheTime) => action => {
  if (action.payload && store[action.type]) {
    const value = store[action.type].get(action.payload);
    if (value && isCached(value, cacheTime)) {
      return value.data;
    }
  }
  return false;
};

/**
 * Set value to cache.
 * @param {object} store - store to use
 * @param {number} cacheTime - time to cache
 * @param {object} action - dispatched action
 * @param {object} data - data to cache
 * @returns {object} data
 */
const setToCache = (store, cacheTime) => (action, data) => {
  if (action.payload) {
    if (store[action.type]) {
      store[action.type].set(action.payload, {
        data: data,
        at: new Date()
      });
      setTimeout(() => {
        store[action.type].delete(action.payload);
      }, cacheTime * 1000);
    }
  }
  return data;
};

/**
 * Delete cached value.
 * @param {object} store - store to use
 * @param {object} action - action dispatched
 * @returns {void}
 */
const delFromCache = store => action => {
  if (action.payload) {
    if (store[action.type]) {
      store[action.type].delete(action.payload);
    }
  }
};

/**
 * Simple cache.
 * @param {array} store - actions to watch
 * @param {number} cacheTime - time to cache
 * @return {object} wrapper store
 */
const cache = (actions, cacheTime = 30) => {
  const store = {};
  actions.forEach(action => (store[action] = new Map()));
  return {
    get: getFromCache(store, cacheTime),
    set: setToCache(store, cacheTime),
    del: delFromCache(store),
    get store() {
      return store;
    }
  };
};

export default cache;
