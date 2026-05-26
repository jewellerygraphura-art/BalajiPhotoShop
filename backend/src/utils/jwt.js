import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});

const create_JwtToken = (user) => {
    try{
        const accessToken = jwt.sign({user}, process.env.Jwt_Key, {expiresIn: "1d"});
        const refreshToken = jwt.sign({user}, process.env.Jwt_Key, {expiresIn: "30d"});

        return {accessToken, refreshToken};
    }
    catch(err){
        console.log(`Error: ${err.message}`)
    }
}

export default create_JwtToken;