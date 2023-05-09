import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:8000/',
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
          if (!window.location.href.endsWith('/unauthorized') && !window.location.href.endsWith('/login') && !window.location.href.endsWith('/applicant-signup') && !window.location.href.endsWith('/member-signup')) {
            window.location.href = '/unauthorized';
          } else {
            throw error;
          }
          break;
        default:
          throw error;
      }
    }
  }
);

export default axiosClient;
