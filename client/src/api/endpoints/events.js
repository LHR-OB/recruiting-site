import axiosClient from "../axiosClient";

const schedulingApi = {
  createEvent: (data) => {
    const url = "/events";
    return axiosClient.post(url, data);
  },
  getEvents: () => {
    const url = "/events";
    return axiosClient.get(url);
  },
  getEvent: (id) => {
    const url = `/events/${id}`;
    return axiosClient.get(url);
  },
  updateEvent: (id, data) => {
    const url = `/events/${id}`;
    return axiosClient.put(url, data);
  },
  joinEvent: (id) => {
    const url = `/events/join/${id}`;
    return axiosClient.put(url);
  },
  deleteEvent: (id) => {
    const url = `/events/${id}`;
    return axiosClient.delete(url);
  },
};

export default schedulingApi;
