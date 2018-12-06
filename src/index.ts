const uuidv4 = require('uuid/v4');


import App from "./App"


const app:App = new App();

app.createRoute('/', onWebRequest);

app.start();

function onWebRequest(req:any, res:any) {
    res.sendFile("/public/index.html", { root: __dirname + "/../"});
   //res.sendFile(__dirname + "/file.json");
}
