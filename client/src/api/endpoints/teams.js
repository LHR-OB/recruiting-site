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

const systemsApi = {
  createSystem: (data) => {
    const url = "/systems";
    return axiosClient.post(url, data);
  },
  getSystems: () => {
    const url = "/systems";
    return axiosClient.get(url);
  },
  getSystemsByTeam: (id) => {
    const url = `/systems/team/${id}`;
    return axiosClient.get(url);
  },
  getSystem: (id) => {
    const url = `/systems/id/${id}`;
    return axiosClient.get(url);
  },
  updateSystem: (id, data) => {
    const url = `/systems/${id}`;
    return axiosClient.put(url, data);
  },
  deleteSystem: (id) => {
    const url = `/systems/${id}`;
    return axiosClient.delete(url);
  }
};

export { teamsApi, systemsApi };
