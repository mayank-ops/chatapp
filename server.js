import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import messageRoutes from './routes/messageRoutes.js'
import { Server } from 'socket.io'
import path from 'path'

// app config
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public/build"));

// db config
connectDB();


// routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

// listen
const server = app.listen(port, () =>
{
    console.log(`server listening on port ${port}`);
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on("connection", (socket) =>
{
    console.log("socket.io connected");
    socket.on('setup', (userData) =>
    {
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on("join chat", (room) =>
    {
        socket.join(room);
        console.log("User Joined Room: " + room);
        console.log(socket.rooms);
    });

    socket.on("typing", (room) =>
    {
        socket.in(room).emit("typing")
    });

    socket.on("stop typing", (room) =>
    {
        socket.in(room).emit("stop typing")
    });

    socket.on("new message", (newMessageRecieved) =>
    {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) =>
        {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () =>
    {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});