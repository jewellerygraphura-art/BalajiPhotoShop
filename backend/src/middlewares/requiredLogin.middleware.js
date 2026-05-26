import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import cookiesForUser from "../utils/cookiesForUser.js";

const jwtVerifierMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.AccessToken;
        const refreshToken = req.cookies?.RefreshToken;

        if (!refreshToken) {
            return res.status(401).json(new ApiError(401, "Session expired, please login again"));
        }

        try {
            // 1. Access Token verify करने की कोशिश करें
            const decoded = jwt.verify(accessToken, process.env.Jwt_Key);
            
            // यहाँ चेक करें: अगर लॉगिन के समय आपने { user: {...} } भेजा था तो .user रहने दें
            // वरना सीधे req.user = decoded; करें
            req.user = decoded.user || decoded; 
            
            return next();
        } catch (err) {
            // 2. अगर Access Token एक्सपायर हो गया है, तो Refresh Token चेक करें
            if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
                try {
                    const decodedRefresh = jwt.verify(refreshToken, process.env.Jwt_Key);
                    
                    req.user = decodedRefresh.user || decodedRefresh;

                    // नए कुकीज़ सेट करें
                    await cookiesForUser(res, req.user);
                    
                    return next(); // return लगाना ज़रूरी है
                } catch (refreshErr) {
                    return res.status(401).json(new ApiError(401, "Invalid Refresh Token, please login again"));
                }
            } else {
                return res.status(500).json(new ApiError(500, err.message));
            }
        }
    } catch (err) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

export default jwtVerifierMiddleware;