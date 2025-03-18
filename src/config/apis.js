import config from "./env";

const VERSION = {
    v1: '/api/v1',
}

const getApiVersion = () => {
    if (process.env.API_VERSION) {
        return process.env.API_VERSION;
    }
    return VERSION.v1;
}

const apiVersion = getApiVersion();

const apiUrl = {
    user: {
        user: `${config.API_URL}${apiVersion}/user`,
    },
    chat: {
        chatbot: `${config.API_URL}${apiVersion}/chat/chatbot`,
        floating: `${config.API_URL}${apiVersion}/chat/floating`,
    },
}

export default apiUrl;