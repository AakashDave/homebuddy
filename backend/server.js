const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/database");


// Hamdling Uncaught Exceptions -> any changes in codes like { clog(youtube) --> where youtube is not defined anywhere}
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting Down The Server due to uncaught exception");
    process.exit(1);
})

// config
dotenv.config({
    path:'backend/config/config.env'
})

// connection to database
connectDatabase()

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})

// unhandled promise rejection --> if mongodb URI changes
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})