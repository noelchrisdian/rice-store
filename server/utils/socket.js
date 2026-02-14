import { Server } from 'socket.io';

let io;

const init = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'https://tokoberasad.up.railway.app'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        socket.on('join:admin', () => {
            socket.join('admin');
        })
    })

    return io;
}

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }

    return io;
}

export {
    getIO,
    init
}