import { HTTPService } from '../../../../common/service/HTTPService';
import { URLS } from '../../../../common/constants/variables';
import {
  FETCHING_BUCKET, FETCH_BUCKET_FAIL, FETCH_BUCKET_SUCCESS,
  FETCHING_TODOS, TODO_FETCH_FAIL, TODO_FETCH_SUCCESS,
  ADDING_TODO, TODO_ADD_FAIL, TODO_ADDED,
  UPDATING_TODO, TODO_UPDATE_FAIL, TODO_UPDATED,
  BUCKET_ADDED, ADDING_BUCKET, ADD_BUCKET_FAIL

} from './types';

export function fetchBuckets() {
  return async (dispatchEvent) => {
    try {
      dispatchEvent({ type: FETCHING_BUCKET })
      const { data } = await HTTPService.get(URLS.BUCKET);
      dispatchEvent({ type: FETCH_BUCKET_SUCCESS, buckets: data })
    } catch (error) {
      dispatchEvent({ type: FETCH_BUCKET_FAIL, error })
    }
  }
};

export function fetchingTodos() {
  return async (dispatchEvent) => {
    try {
      dispatchEvent({ type: FETCHING_TODOS })
      const { data } = await HTTPService.get(URLS.TODOS);
      dispatchEvent({ type: TODO_FETCH_SUCCESS, todos: data })
    } catch (error) {
      dispatchEvent({ type: TODO_FETCH_FAIL, error })
    }
  }
};

export function addTodo(payload, history) {
  return async (dispatchEvent) => {
    try {
      const urls = `${URLS.TODOS}`;
      dispatchEvent({ type: ADDING_TODO })
      const response = await HTTPService.post(urls, payload);
      dispatchEvent({ type: TODO_ADDED, todo: response })
      if (history) {
        history.goBack();
      }
    } catch (error) {
      dispatchEvent({ type: TODO_ADD_FAIL, error })
    }
  }
};

export function updateTodo(payload, history) {
  return async (dispatchEvent) => {
    try {
      const urls = `${URLS.TODOS}${payload._id}`;
      dispatchEvent({ type: UPDATING_TODO })
      const todo = await HTTPService.put(urls, payload);
      dispatchEvent({ type: TODO_UPDATED, todo })
      if (history) {
        history.goBack();
      }
    } catch (error) {
      dispatchEvent({ type: TODO_UPDATE_FAIL, error })
    }
  }
};

export function addBucket(bucket) {
  return async (dispatchEvent) => {
    dispatchEvent({ type: BUCKET_ADDED, bucket })
  }
};