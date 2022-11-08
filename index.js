const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('photo magic running in server display side')
})

app.listen(port, () => {
    console.log(`photo magic server running on : ${port}`);
})