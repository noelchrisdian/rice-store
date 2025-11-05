import 'dotenv/config';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import { authenticated, authorize } from './middlewares/auth.js';
import { connectDB } from './utils/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notification } from './api/orders/controller.js';
import { router as adminRouter } from './api/admin/router.js';
import { router as authRouter } from './api/auth/router.js';
import { router as customerRouter } from './api/customers/router.js';
import { router as globalRouter } from './api/global/router.js';

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
    .use('/admin', authenticated, authorize('admin'), adminRouter)
    .use('/customers', authenticated, authorize('customer'), customerRouter)
    .post('/midtrans-notification', notification)
    .use('/', authRouter)
    .use('/', globalRouter)
    .use(errorHandler)

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})