import 'dotenv/config';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import { authenticated, authorize } from './middlewares/auth.js';
import { connectDB } from './utils/db.js';
import { createServer } from 'http';
import { errorHandler } from './middlewares/errorHandler.js';
import { init } from './utils/socket.js';
import { notification } from './api/orders/controller.js';
import { rateLimit } from 'express-rate-limit';
import { router as adminRouter } from './api/admin/router.js';
import { router as authRouter } from './api/auth/router.js';
import { router as customerRouter } from './api/customers/router.js';
import { router as globalRouter } from './api/global/router.js';

const app = express();
const port = process.env.PORT || 3000;

const server = createServer(app);
init(server);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    statusCode: 429,
    message: {
        status: 'failed',
        data: null,
        message: 'Terlalu banyak request, silakan coba lagi nanti'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 64
})

connectDB();

app
    .set('trust proxy', 1)
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(express.static('public'))
    .use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to AD Rice Store API');
})

app.post('/midtrans-notification', notification);

app
    .use(limiter)
    .use('/', authRouter)
    .use('/', globalRouter)
    .use('/admin', authenticated, authorize('admin'), adminRouter)
    .use('/customers', authenticated, authorize('customer'), customerRouter)
    .use(errorHandler)

server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})