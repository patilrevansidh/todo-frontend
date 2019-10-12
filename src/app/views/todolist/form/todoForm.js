import {
  TOGGLE_FORM, TODO_ADDED, ADDING_TODO, TODO_ADD_FAIL,
} from './action/types';

const initState = {
  showForm: false,
  fetchingBuckets: false, fetchingTodos: false, todoLoader: false,
  bucketError: null, todoError: null
}
/**
 * All Utils toggling or Modal or other small state could be stored here. ` 
 */
export const todoState = (state = initState, action) => {
  switch (action.type) {

    case TOGGLE_FORM:
      return { ...state, showForm: !state.showForm };

    case ADDING_TODO:
      return { ...state, todos: action.todos, todoLoader: true };
    case TODO_ADDED:
      return { ...state, todos: [...action.todos, action.todo], todoLoader: false };
    case TODO_ADD_FAIL:
      return { ...state, todos: action.todos, todoLoader: false, todoError: action.error };

    default:
      return state;
  }
}