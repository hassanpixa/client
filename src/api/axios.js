import axios from "axios";
const url = "https://localhost:300/?baseUrl=https://car.develop.somomarketingtech.com/api/&userId=1"

const queryString = window.location.search
console.log(queryString,'queryString')


const urlParams = new URLSearchParams(queryString);
const baseUrl = urlParams.get('baseUrl')
console.log(baseUrl,'base url')
const userId = urlParams.get('userId')
console.log(userId,'user id')

const instance = axios.create({
  baseURL: baseUrl,
});


instance.interceptors.request.use(
  (config) => {
    if (userId) {
      config.headers.Authorization = `Bearer ${userId}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default instance;
