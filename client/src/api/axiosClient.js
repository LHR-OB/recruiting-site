import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  }
);

axiosClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // TODO: Handle 401
          break;
        default:
          throw error;
      }
    }
  }
);

export default axiosClient;
