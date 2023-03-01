import express from 'express';
import cors from 'cors';
import path from 'path'

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

app.use('/public', express.static(path.join(__dirname, 'storage')));

app.listen(5000, console.log("Server is running on PORT 5000"));