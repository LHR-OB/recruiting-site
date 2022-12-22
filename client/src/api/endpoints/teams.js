import axiosClient from "../axiosClient";

const teamsApi = {
  createTeam: (data) => {
    const url = "/teams";
    return axiosClient.post(url, data);
  },
  getTeams: () => {
    const url = "/teams";
    return axiosClient.get(url);
  },
  getTeam: (id) => {
    const url = `/teams/id/${id}`;
    return axiosClient.get(url);
  },
  updateTeam: (id, data) => {
    const url = `/teams/${id}`;
    return axiosClient.put(url, data);
  },
  deleteTeam: (id) => {
    const url = `/teams/${id}`;
    return axiosClient.delete(url);
  }
};

export default teamsApi;
