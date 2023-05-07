import axios from "axios";

export let axiosInstance = axios.create({
  baseURL: "https://api.deepmd.io/covid/api/v1.0/"
});
