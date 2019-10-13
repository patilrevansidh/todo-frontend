import {
  TOGGLE_FORM, FETCHING_BUCKET, FETCH_BUCKET_SUCCESS, FETCH_BUCKET_FAIL,
  FETCHING_TODOS, TODO_FETCH_FAIL, TODO_FETCH_SUCCESS,
  TODO_ADDED, ADDING_TODO, TODO_ADD_FAIL,
  ADDING_BUCKET, ADD_BUCKET_FAIL, BUCKET_ADDED
} from './action/types';

const initState = {
  showForm: false, buckets: [], todos: [],
  bucketLoader: false, bucketError: null,
  todoLoader: false, todoError: null
}
/**
 * All Utils toggling or Modal or other small state could be stored here. ` 
 */
export const todoState = (state = initState, action) => {
  switch (action.type) {
    // case TOGGLE_FORM:
    //   return { ...state, showForm: !state.showForm };

    case FETCHING_BUCKET:
      return { ...state, buckets: action.buckets, bucketLoader: true, bucketError: null };
    case FETCH_BUCKET_SUCCESS:
      return { ...state, buckets: action.buckets, bucketLoader: false, };
    case FETCH_BUCKET_FAIL:
      return { ...state, bucketLoader: false, bucketError: action.error };

    case FETCHING_TODOS:
      return { ...state, todos: [], todoLoader: true, todoError: null };
    case TODO_FETCH_SUCCESS:
      return { ...state, todos: action.todos, todoLoader: false, };
    case TODO_FETCH_FAIL:
      return { ...state, todoLoader: false, todoError: action.error };

    case ADDING_TODO:
      return { ...state, todos: action.todos, todoLoader: true };
    case TODO_ADDED:
      return { ...state, todos: [...action.todos, action.todo], todoLoader: false };
    case TODO_ADD_FAIL:
      return { ...state, todos: action.todos, todoLoader: false, todoError: action.error };

    case ADDING_BUCKET:
      return { ...state, bucketLoader: true, bucketError: null };

    case BUCKET_ADDED:
      return { ...state, buckets: [...state.buckets, action.bucket], bucketLoader: false };

    default:
      return state;
  }
}