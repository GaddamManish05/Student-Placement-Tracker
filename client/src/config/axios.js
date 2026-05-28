import axios from "axios";

const api = axios.create({

  baseURL:
    "https://student-placement-tracker-camg.onrender.com",

  withCredentials: true,

});

export default api;