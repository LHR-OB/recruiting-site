import axiosClient from "../axiosClient";

const availabilitiesApi = {
  createAvailability: (data) => {
    const url = "/availabilities";
    return axiosClient.post(url, data);
  },
  getAvailabilities: () => {
    const url = "/availabilities";
    return axiosClient.get(url);
  },
  getAvailability: (id) => {
    const url = `/availabilities/id/${id}`;
    return axiosClient.get(url);
  },
  getAvailabilitiesByUser: (id) => {
    const url = `/availabilities/user/${id}`;
    return axiosClient.get(url);
  },
  getAvailabilitiesCurrentUser: () => {
    const url = `/availabilities/user`;
    return axiosClient.get(url);
  },
  updateAvailability: (id, data) => {
    const url = `/availabilities/${id}`;
    return axiosClient.put(url, data);
  },
  deleteAvailability: (id) => {
    const url = `/availabilities/${id}`;
    return axiosClient.delete(url);
  },
};

export default availabilitiesApi;
