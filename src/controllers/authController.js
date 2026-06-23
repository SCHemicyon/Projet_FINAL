import axios from "axios";

export function login(req, res) {
    const params = new URLSearchParams({
        client_id: process.env.BLIZZARD_CLIENT_ID,
        redirect_uri: process.env.BLIZZARD_REDIRECT_URI,
        response_type: "code",
        scope: "openid wow.profile",
        state: "rosterforge"
    });

    res.redirect(
        `https://oauth.battle.net/authorize?${params.toString()}`
    );
}

export async function callback(req, res) {
    const { code } = req.query;
 console.log("REQ QUERY :", req.query);
    if (!code) {
        return res.redirect("/");
    }

    try {
        const tokenResponse = await axios.post(
            "https://eu.battle.net/oauth/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.BLIZZARD_REDIRECT_URI
            }),
            {
                auth: {
                    username: process.env.BLIZZARD_CLIENT_ID,
                    password: process.env.BLIZZARD_CLIENT_SECRET
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
console.log("TOKEN RESPONSE :", tokenResponse.data);
        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get(
            "https://eu.battle.net/oauth/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
 console.log("USER RESPONSE :", userResponse.data);

        req.session.user = {
            id: userResponse.data.id,
            battletag: userResponse.data.battletag,
            token: accessToken
        };
console.log("SESSION :", req.session.user);
        res.redirect("/dashboard");

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.redirect("/");
    }
}

export function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/");
    });
}