import axiosClient from "../axiosClient";

const interviewsApi = {
    createInterview: (data) => {
        const url = "/interviews";
        return axiosClient.post(url, data);
    },
    getInterviews: () => {
        const url = "/interviews";
        return axiosClient.get(url);
    },
    getInterviewsByUser: (id) => {
        const url = `/interviews/user/${id}`;
        return axiosClient.get(url);
    },
    getInterviewsByTeam: (id) => {
        const url = `/interviews/team/${id}`;
        return axiosClient.get(url);
    },
    getInterviewsBySystem: (id) => {
        const url = `/interviews/system/${id}`;
        return axiosClient.get(url);
    },
    getInterviewsCurrentUser: () => {
        const url = `/interviews/user`;
        return axiosClient.get(url);
    },
    getInterview: (id) => {
        const url = `/interviews/id/${id}`;
        return axiosClient.get(url);
    },
    updateInterview: (id, data) => {
        const url = `/interviews/${id}`;
        return axiosClient.put(url, data);
    },
    deleteInterview: (id) => {
        const url = `/interviews/${id}`;
        return axiosClient.delete(url);
    },
}

const interviewNotesApi = {
    createInterviewNote: (data) => {
        const url = "/interview-notes";
        return axiosClient.post(url, data);
    },
    getInterviewNotes: () => {
        const url = "/interview-notes";
        return axiosClient.get(url);
    },
    getInterviewNotesByInterview: (id) => {
        const url = `/interview-notes/interview/${id}`;
        return axiosClient.get(url);
    },
    getInterviewNote: (id) => {
        const url = `/interview-notes/${id}`;
        return axiosClient.get(url);
    },
    updateInterviewNote: (id, data) => {
        const url = `/interview-notes/${id}`;
        return axiosClient.put(url, data);
    },
    deleteInterviewNote: (id) => {
        const url = `/interview-notes/${id}`;
        return axiosClient.delete(url);
    },
}

export { interviewsApi, interviewNotesApi };
