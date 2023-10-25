import axios from "axios";
const url = "https://localhost:300/?baseUrl=https://car.develop.somomarketingtech.com/api/&userId=1"

console.log('=========================== METHOD 1')
const queryString = window.location.search
console.log(queryString,'queryString')


const urlParams = new URLSearchParams(url);
const baseUrl = urlParams.get('baseUrl')
console.log(baseUrl,'base url')
const userId = urlParams.get('userId')
console.log(userId,'user id')

console.log('=========================== METHOD 2')
const urlObject = new URL(url);
const baseUrl2 = urlObject.searchParams.get('baseUrl');
console.log(baseUrl2, 'base url');

const userId2 = urlObject.searchParams.get('userId');
console.log(userId2, 'user id');

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER,
});
export default instance;
