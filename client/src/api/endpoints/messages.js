import axiosClient from "../axiosClient";

const messagesApi = {
    createMessage: (data) => {
        const url = "/messages";
        return axiosClient.post(url, data);
    },
    getMessages: () => {
        const url = "/messages";
        return axiosClient.get(url);
    },
    getMessage: (id) => {
        const url = `/messages/${id}`;
        return axiosClient.get(url);
    },
    getMessagesByUser: (id) => {
        const url = `/messages/user/${id}`;
        return axiosClient.get(url);
    },
    getMessagesCurrentUser: () => {
        const url = "/messages/user";
        return axiosClient.get(url);
    },
    updateMessage: (id, data) => {
        const url = `/messages/${id}`;
        return axiosClient.put(url, data);
    },
    readMessage: (id) => {
        const url = `/messages/read/${id}`;
        return axiosClient.put(url);
    },
    deleteMessage: (id) => {
        const url = `/messages/${id}`;
        return axiosClient.delete(url);
    },
};

export default messagesApi;
