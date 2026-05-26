import jwtTokenCreater from "./jwt.js";

const cookiesForUser = async (res, user) => {
    const { accessToken, refreshToken } = await jwtTokenCreater(user);

    res.cookie("AccessToken", accessToken, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("RefreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return;
};


export default cookiesForUser;