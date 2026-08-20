// redux-persist needs a storage engine. On the server (Next.js SSR/build)
// `window` doesn't exist, so we fall back to an in-memory no-op engine.
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

export default storage;
