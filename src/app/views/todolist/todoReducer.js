import {
  ADDING_BUCKET, ADDING_TODO, BUCKET_ADDED, FETCHING_BUCKET, FETCHING_TODOS,
  FETCH_BUCKET_FAIL, FETCH_BUCKET_SUCCESS, TODO_ADDED, TODO_ADD_FAIL, TODO_FETCH_FAIL,
  TODO_FETCH_SUCCESS
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
      return { ...state, todoLoader: true, todoError: null };
    case TODO_FETCH_SUCCESS:
      return { ...state, todos: action.todos, todoLoader: false, };
    case TODO_FETCH_FAIL:
      return { ...state, todoLoader: false, todoError: action.error };

    case ADDING_TODO:
      return { ...state, todoLoader: true };
    case TODO_ADDED:
      return { ...state, todos: [...state.todos, action.todo], todoLoader: false };
    case TODO_ADD_FAIL:
      return { ...state, todoLoader: false, todoError: action.error };

    case ADDING_BUCKET:
      return { ...state, bucketLoader: true, bucketError: null };

    case BUCKET_ADDED:
      return { ...state, buckets: [...state.buckets, action.bucket], bucketLoader: false };

    default:
      return state;
  }
}