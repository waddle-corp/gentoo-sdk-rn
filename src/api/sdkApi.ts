import axios from "axios";

const api = axios.create({
    baseURL: "https://api.gentoo.com/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

export async function fetchFloatingData(partnerId: string, displayLocation: string) {
    try {
        const response = await fetch(
            `https://dev-api.gentooai.com/chat/api/v1/chat/floating/${partnerId}?displayLocation=${displayLocation}`,
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