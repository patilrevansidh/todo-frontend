import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { todoState } from '../views/todolist/todoReducer';

const reducers = combineReducers({ todoState })

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers, composeEnhancers(
  applyMiddleware(thunk)
));
