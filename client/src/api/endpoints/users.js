import axiosClient from "../axiosClient";

const usersApi = {
  createApplicant: (data) => {
    const url = "/users/applicant";
    return axiosClient.post(url, data);
  },
  createMember: (data) => {
    const url = "/users/member";
    return axiosClient.post(url, data);
  },
  getToken: (data) => {
    const url = "/token";
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    return axiosClient.post(url, formData, {
      headers: {
        "Accept" : "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });
  },
  getUser: () => {
    const url = "/users/current";
    return axiosClient.get(url);
  },
  getUserById: (id) => {
    const url = `/users/id/${id}`;
    return axiosClient.get(url);
  },
  getUserByEmail: (email) => {
    const url = `/users/email/${email}`;
    return axiosClient.get(url);
  },
  getUsersMembers: () => {
    const url = "/users/members";
    return axiosClient.get(url);
  },
  getUsersByTeam: (teamId) => {
    const url = `/users/team/${teamId}`;
    return axiosClient.get(url);
  },
  getUsersBySystem: (systemId) => {
    const url = `/users/system/${systemId}`;
    return axiosClient.get(url);
  },
  getUsersByEvent: (eventId) => {
    const url = `/users/event/${eventId}`;
    return axiosClient.get(url);
  },
  approveUser: (id) => {
    const url = `/users/approve/${id}`;
    return axiosClient.put(url);
  },
  joinSystem: (id, system_id) => {
    const url = `/users/join-system/${id}/${system_id}`;
    return axiosClient.put(url);
  },
  leaveSystem: (id, system_id) => {
    const url = `/users/leave-system/${id}/${system_id}`;
    return axiosClient.put(url);
  },
  updateUser: (id, data) => {
    const url = `/users/${id}`;
    return axiosClient.put(url, data);
  },
  generatePasswordResetCode: (email) => {
    const url = `/users/password/reset-code/${email}`;
    return axiosClient.put(url);
  },
  resetPassword: (data) => {
    const url = "/users/password/reset";
    return axiosClient.put(url, data);
  }
};

export default usersApi;
