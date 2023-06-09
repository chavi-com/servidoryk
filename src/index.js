const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cors = require("cors");

const app = express();
app.use(cors());



const port = process.env.PORT || 9000;
//middleware

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', productRoutes);


//routes
app.get('/',(req, res) => {
    res.send("wwlcomet to api");
});
  

// conectar mongo
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("conectado en mongo")).catch((error) => console.error(error));


app.listen(port, () => console.log('server listening on port',port) ) ;