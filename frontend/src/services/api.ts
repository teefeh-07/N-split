// API Service

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.hiro.so",
  timeout: 10000,
});

