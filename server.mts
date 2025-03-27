import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.HOSTNAME || "localhost"
const port = parseInt(process.env.PORT || "3000", 10)

const app = next({ dev, hostname, port })
const requestHandler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(requestHandler)
  const io = new Server(httpServer)

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`)

    socket.on("joinRoom", ({ username, room }) => {
      socket.join(room)
      console.log(`👤 ${username} joined ${room}`)
      socket.to(room).emit("User_Joined", `${username} joined the room`)
    })

    socket.on("message", ({ room, message, sender }) => {
      console.log(`📨 ${sender} sent message to ${room}: ${message}`)
      socket.to(room).emit("message", { sender, message })
    })

    // ✅ Forward typing with sender name
    socket.on("typing", ({ room, sender }) => {
      socket.to(room).emit("typing", sender)
    })

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`)
    })
  })

  httpServer.listen(port, () => {
    console.log(`🚀 Server running on http://${hostname}:${port}`)
  })
})
