const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
// const userCollection = require("../model/userModel")
dotenv.config();
const saltRound = 10
const secretKey = process.env.secretKey;


const register = async (req,res) => {
    const userData = req.body;
    const IsRegistered = await userCollection.findOne({ userEmail: { $eq: userData.userEmail } });
    if (IsRegistered) {
        return res.send({ "Message": "User Already Exists..!!" });
    } else {
        userData.userPassword = bcrypt.hashSync(userData.userPassword, saltRound);
        const Result = await userCollection.create(userData);

        if (Result) {
            const generatedToken = JWT.sign({ "User_Token": userData.userEmail }, secretKey);
            return res.send({ Message: "User Registered Successfully", "Token": generatedToken });
        } else {
            return res.send({ Message: "Something Went Wrong, Please Try Again..!!" });
        }
    };

};

const login = async (req,res) => {
    const loginData = req.body;

    const findUser = await userCollection.findOne({ userEmail: { $eq: loginData.userEmail } });

    if (!findUser) {
        return res.send({ resMsg: "User Not Registred or Email Is Not Correct" });
    }
    const compared = bcrypt.compareSync(loginData.userPassword, findUser.userPassword);

    if (compared) {
        const Token = JWT.sign({ "User Logged": loginData.userEmail }, secretKey, { expiresIn: "15d" });
        return res.send({Message: "User Loggin Successfully", "Token": Token, "UserDetails": findUser });
    } else {
        return res.send({Message: "Password Incorrect Please Check..!!" });
    }
}

module.exports = { register,login}