import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/` || "http://localhost:3001/";
export const connection = axios.create({
  baseURL: BASE_URL,
});


const SERVER_BASE_URL = `${process.env.NEXT_SERVER_API_URL}/` || "http://localhost:3001/";
export const serverConnection = axios.create({
  baseURL: SERVER_BASE_URL,
});