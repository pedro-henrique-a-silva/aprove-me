import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/` || "http://localhost:3001/";
export const connection = axios.create({
  baseURL: BASE_URL,
});