import axios from 'axios';
import { URLS } from '../constants/variables';

const axiosInstance = axios.create({
  baseURL: URLS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// axiosInstance.interceptors.request.use((config) => {
//   config.headers["user-key"] = localStorage.getItem('accessToken') || '';
//   return config
// })

export class HTTPService {

  static get(url, params) {
    return new Promise((resolve, reject) => {
      axiosInstance.get(url, { params: params })
        .then(response => {
          if (response.status === 200) {
            resolve(response.data)
          }
        })
        .catch((error) => reject(error))
    })
  }

  static put(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance.put(url, body)
        .then(response => {
          resolve(response)
        })
        .catch((error) => reject(error))
    })
  }

  static post(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance.post(url, body)
        .then(response => {
          resolve(response)
        })
        .catch((error) => reject(error))
    })
  }

  static delete(url) {
    return new Promise((resolve, reject) => {
      axiosInstance.delete(url)
        .then(response => {
          resolve(response)
        })
        .catch((error) => reject(error))
    })
  }
}

// function saveToken(reponse) {
//   if (reponse.data && reponse.data.accessToken) {
//     localStorage.setItem('accessToken', reponse.data.accessToken)
//   }
// }