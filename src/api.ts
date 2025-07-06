import axios from 'axios';

// Create instance
export const api = axios.create({
  baseURL: 'https://api.freeapi.app/api/v1/social-media',
  headers: {
    'Content-Type': 'application/json',
  },
});
