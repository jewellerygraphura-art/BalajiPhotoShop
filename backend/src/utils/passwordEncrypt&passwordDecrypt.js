import bcrypt from "bcrypt";

let saltRound = 15;

const encryptPasswordMethod = async (password) => {
    try{
        let encryptPassword = await bcrypt.hash(password, saltRound);
        return encryptPassword;
    }
    catch(err){
        console.log(`Error: ${err.message}`)
    }
}

const decryptPasswordMethod = async (password, hashPassword) => {
    try{
        let decryptPassword = await bcrypt.compare(password, hashPassword);
        return decryptPassword
    }
    catch(err){
        console.log(`Error: ${err.message}`)
    }
}

export {encryptPasswordMethod, decryptPasswordMethod};