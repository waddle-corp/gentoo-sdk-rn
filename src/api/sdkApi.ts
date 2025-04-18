import axios from "axios";
import apiUrl from "../config/apis";

const api = axios.create({
    baseURL: apiUrl.chat.chatbot,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function fetchChatUserId(userToken: string, udid: string = "") {
    console.log('api.defaults.baseURL', api.defaults.baseURL);
    try {
        const url = `${apiUrl.user.user}?userToken=${userToken}&udid=${udid}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {},
        });

        const res = await response.json();
        console.log('chatUserId', res);
        return res.chatUserId;
    } catch (error) {
        console.error(`Error while calling fetchChatUserId API: ${error}`);
    }
}

export async function fetchChatbotData(partnerId: string) {
    try {
        const response = await fetch(`${apiUrl.chat.chatbot}/${partnerId}`, {
            method: "GET",
            headers: {},
        });
        const res = await response.json();
        console.log('chatbotData', res);
        return res;
    } catch (error) {
        console.error(`Error while calling fetchChatbotId API: ${error}`);
    }
}

export async function fetchFloatingData(partnerId: string, displayLocation: string) {
    try {
        const response = await fetch(
            `${apiUrl.chat.floating}/${partnerId}?displayLocation=${displayLocation}`,
            {
                method: "GET",
                headers: {},
            }
        );

        const res = await response.json();
        console.log(res);
        return res;
    } catch (error) {
        console.error(`Error while calling fetchFloatingData API: ${error}`);
    }
}

export async function logEvent(payload: any) {
    const chatUserId = await fetchChatUserId(payload.authCode);
    try {
        const params = {
            eventCategory: String(payload.eventCategory),
            chatUserId: String(chatUserId),
            partnerId: String(payload.partnerId),
            channelId: 'mobile',
            products: payload?.products,
        };

        const response = await fetch(`${apiUrl.chat.log}/${payload.partnerId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        const res = await response.json();
        return res;
    } catch (error) {
        console.error(`Error while calling logEvent API: ${error}`);
    }
}