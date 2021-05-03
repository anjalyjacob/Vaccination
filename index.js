var express = require('express');
var cors = require('cors');
var app = express();
var bodyparser = require('body-parser');

const port = 3000;

const connectToDatabase = require('./db/connection');

connectToDatabase();

app.use(bodyparser.json());
app.use(cors());
const vaccinationRoute = require("./routes/Vaccination");

app.use("/vaccination", vaccinationRoute);


app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`))