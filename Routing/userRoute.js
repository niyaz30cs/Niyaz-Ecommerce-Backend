const userRoute = require("express").Router();
const { register, login } = require("../controller/userController");

userRoute.post("/register",register);

userRoute.post("/login",login);

userRoute.post("/saveCart", (req, res) => {
    const bodyData = req.body;
    let IsPresent = CartDataBase.some((user) => user.currentUserMail === bodyData.currentUserMail);
    if (IsPresent) {
        let Index = CartDataBase.map((user, index) => {
            if (user.currentUserMail === bodyData.currentUserMail) {
                return index
            }
        }).filter((data) => typeof data === "number");
        const currentOwner = CartDataBase[Index];
        currentOwner.currentDetails = tempData.currentDetails
        CartDataBase[Index].currentDetails = currentOwner.currentDetails
        res.send(CartDataBase)
    } else {
        CartDataBase.push(bodyData);
        res.send(CartDataBase)
    }

});

userRoute.get("/loadCart", (req, res)=>{
    return res.send(CartDataBase);
})


module.exports = userRoute;