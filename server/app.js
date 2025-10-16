import 'dotenv/config';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import { connectDB } from './utils/db.js';

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app
    .use(express.static('public'))
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to AD Rice Store API')
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})