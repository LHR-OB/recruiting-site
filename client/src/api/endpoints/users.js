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
  getUsersMembers: () => {
    const url = "/users/members";
    return axiosClient.get(url);
  },
  getUsersByTeam: (teamId) => {
    const url = `/users/team/${teamId}`;
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
  // TODO: Remove after dev
  protected: () => {
    const url = "/protected";
    return axiosClient.get(url);
  }
};

export default usersApi;
