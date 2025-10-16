import mongoose from "mongoose";

const connectDB = async () => {
    const connection = mongoose.connection;

    connection.on('open', (_) => {
        console.log('Database connected');
    })

    connection.on('error', (error) => {
        console.log(`Connection error : ${error}`)
    })

    try {
        await mongoose.connect(process.env.URL_DB);
    } catch (error) {
        console.log(`Database connection error : ${error}`)
        process.exit(1);
    }
}

export {
    connectDB
}