const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require("mongoose");
const port = 4000;

mongoose.connect("mongodb+srv://Saurav:connectBabe@mydb.wqgpv.mongodb.net/?retryWrites=true&w=majority",)
.then(() => console.log("Database connected!")).catch(err => console.log(err));

app.use(express.json());
app.use(cors())
app.use("/api/auth", require("./model/auth"))
app.listen(port, ()=> {
  console.log(`localhost${port}`);
})