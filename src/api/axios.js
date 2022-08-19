import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.1.35:4002/",
});

export function setHeader(token) {
  // Set Axios instance to use a global header
  // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
}
 
