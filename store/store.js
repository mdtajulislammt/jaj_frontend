import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./storage";

import productsReducer from "./slices/productsSlice";
import suppliersReducer from "./slices/suppliersSlice";
import customersReducer from "./slices/customersSlice";
import purchaseOrdersReducer from "./slices/purchaseOrdersSlice";
import salesReducer from "./slices/salesSlice";
import returnsReducer from "./slices/returnsSlice";
import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";
import settingsReducer from "./slices/settingsSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  suppliers: suppliersReducer,
  customers: customersReducer,
  purchaseOrders: purchaseOrdersReducer,
  sales: salesReducer,
  returns: returnsReducer,
  cart: cartReducer,
  ui: uiReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: "electro-pos-root-v2",
  version: 2,
  storage,
  // fresh v2 key loads all 20 demo products with images
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const store = makeStore();
export const persistor = persistStore(store);
