const express = require("express");

const cors = require('cors')
const services = require("./services")

const {
    badRequestHandler,
    notFoundHandler,
    genericErrorHandler,
  } = require("./errorHandler")



const server = express();
const port = process.env.PORT 




server.use(cors());
server.use(express.json());
server.use("/api",services)

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);






server.listen (port, () =>{
    console.log(' ✅  Server is running on port ' + port )
});


server.on("error",(error)=>{
    console.error(' ❌ Error : server is not running :  ' + error )
});