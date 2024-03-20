import { configureStore } from '@reduxjs/toolkit';

import categoryReducer from './reducers/categoryReducer';
import globalReducer from './reducers/globalReducer';
import orderReducer from './reducers/orderReducer';
import productReducer from './reducers/productReducer';

export const store = configureStore({
  reducer: {
    productReducer,
    categoryReducer,
    globalReducer,
    orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
