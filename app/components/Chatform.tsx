"use client"
import React, { useState } from "react"
import { socket } from "../../lib/socketClient"

type Props = {
  onSendMessage: (message: string) => void
  room: string
  userName: string
}

const Chatform = ({ onSendMessage, room, userName }: Props) => {
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)

    // Emit typing with sender info
    if (room && e.target.value.trim()) {
      socket.emit("typing", { room, sender: userName })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 items-center mt-3">
      <input
        type="text"
        value={message}
        placeholder="Type your message here..."
        onChange={handleChange}
        className="flex-grow px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">
        Send
      </button>
    </form>
  )
}

export default Chatform
