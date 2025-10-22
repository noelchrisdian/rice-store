import 'dotenv/config';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import { connectDB } from './utils/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { router as authRouter } from './api/auth/router.js';
import { router as productRouter } from './api/products/router.js';
import { authenticated, authorize } from './middlewares/auth.js';

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(express.static('public'))
    .use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to AD Rice Store API')
})

app
    .use('/admin/products', authenticated, authorize('admin'), productRouter)
    .use('/', authRouter)
    .use(errorHandler)

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})