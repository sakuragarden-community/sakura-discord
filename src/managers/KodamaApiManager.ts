import axios from "axios";

export class KodamaApiManager {

    public async getBearerToken(): Promise<string> {
        const baseUrl = process.env.KODAMA_API_BASE_URL;
        const clientId = process.env.KODAMA_CLIENT_ID;
        const clientSecret = process.env.KODAMA_CLIENT_SECRET;

        if (!baseUrl || !clientId || !clientSecret) {
            throw new Error("KODAMA_API_BASE_URL, KODAMA_CLIENT_ID e KODAMA_CLIENT_SECRET devono essere definite nel file .env");
        }

        const response = await axios.post(
            `${baseUrl}/oauth2/token`,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.access_token;
    }
}
