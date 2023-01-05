import axiosClient from "../axiosClient";

const applicationsApi = {
  createApplication: (data) => {
    const url = "/applications";
    return axiosClient.post(url, data);
  },
  getApplications: () => {
    const url = "/applications";
    return axiosClient.get(url);
  },
  getApplicationsByCycle: (cycle_id) => {
    const url = `/applications/${cycle_id}`;
    return axiosClient.get(url);
  },
  getApplicationsByTeam: (cycle_id, team_id) => {
    const url = `/applications/${cycle_id}/${team_id}`;
    return axiosClient.get(url);
  },
  getApplicationsBySystem: (cycle_id, team_id, system) => {
    const url = `/applications/${cycle_id}/${team_id}/${system}`;
    return axiosClient.get(url);
  },
  getApplicationsByUser: (cycle_id, id) => {
    const url = `/applications/${cycle_id}/user/id/${id}`;
    return axiosClient.get(url);
  },
  updateApplication: (id, data) => {
    const url = `/applications/${id}`;
    return axiosClient.put(url, data);
  },
  deleteApplication: (id) => {
    const url = `/applications/${id}`;
    return axiosClient.delete(url);
  }
}

const applicationCyclesApi = {
  createApplicationCycle: (data) => {
    const url = "/application-cycles";
    return axiosClient.post(url, data);
  },
  getApplicationCycles: () => {
    const url = "/application-cycles";
    return axiosClient.get(url);
  },
  getApplicationCycleActive: () => {
    const url = "/application-cycles/active";
    return axiosClient.get(url);
  },
  updateApplicationCycle: (id, data) => {
    const url = `/application-cycles/${id}`;
    return axiosClient.put(url, data);
  },
  deleteApplicationCycle: (id) => {
    const url = `/application-cycles/${id}`;
    return axiosClient.delete(url);
  }
}

export { applicationsApi, applicationCyclesApi };
