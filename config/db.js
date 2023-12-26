const mongoose=require("mongoose");
mongoose.set("strictQuery",true)
const dotenv=require("dotenv");
dotenv.config();

const cloudUrl="mongodb+srv://niyaz30cs:Niyaz786@cluster0.kxsn674.mongodb.net/ecommerce?retryWrites=true&w=majority"

const connection=async()=>{
    try
    {
            await mongoose.connect(cloudUrl)
            console.log("DB Connection Successfully..!!!");
    }
    catch(err)
    {
        console.log("Error in Making connection with the DB",err);
    }
}

module.exports={connection};