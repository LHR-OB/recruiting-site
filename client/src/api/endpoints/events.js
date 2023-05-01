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
    const url = `/events/id/${id}`;
    return axiosClient.get(url);
  },
  getEventsByUser: (id) => {
    const url = `/events/user/${id}`;
    return axiosClient.get(url);
  },
  getEventsCurrentUser: () => {
    const url = `/events/user`;
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
  leaveEvent: (id) => {
    const url = `/events/leave/${id}`;
    return axiosClient.put(url);
  },
  addUserToEvent: (id, user_id) => {
    const url = `/events/add/${id}/${user_id}`;
    return axiosClient.put(url);
  },
  removeUserFromEvent: (id, user_id) => {
    const url = `/events/remove/${id}/${user_id}`;
    return axiosClient.put(url);
  },
  deleteEvent: (id) => {
    const url = `/events/${id}`;
    return axiosClient.delete(url);
  },
};

export default schedulingApi;
