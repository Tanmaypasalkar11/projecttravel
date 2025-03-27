"use client"
import React, { useEffect, useRef, useState } from 'react'
import Chatform from './Chatform'
import ChatMessage from './ChatMessage'
import { socket } from '../../lib/socketClient'

const ChatBox = () => {
  const [room, setRoom] = useState("")
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState<{ sender: string; message: string; isOwnMessage: boolean }[]>([])
  const [userName, setUserName] = useState("")
  const [typingUser, setTypingUser] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleUserJoined = (message: string) => {
      setMessages((prev) => [...prev, { sender: "System", message: `💬 ${message}`, isOwnMessage: false }])
    }

    const handleMessage = (data: { sender: string; message: string }) => {
      setMessages((prev) => [...prev, { ...data, isOwnMessage: false }])
    }

    const handleTyping = (sender: string) => {
      if (sender === userName) return
      setTypingUser(sender)
      setTimeout(() => setTypingUser(""), 2000)
    }

    socket.on("User_Joined", handleUserJoined)
    socket.on("message", handleMessage)
    socket.on("typing", handleTyping)

    return () => {
      socket.off("User_Joined", handleUserJoined)
      socket.off("message", handleMessage)
      socket.off("typing", handleTyping)
    }
  }, [userName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName }
    setMessages((prev) => [...prev, { sender: userName, message, isOwnMessage: true }])
    socket.emit("message", data)
  }

  const handleJoin = () => {
    if (room && userName) {
      socket.emit("joinRoom", { username: userName, room })
      setJoined(true)
    }
  }

  return (
    <div className="mt-24 flex justify-center w-full">
      {!joined ? (
        <div className='w-full max-w-2xl flex flex-col items-center mx-auto px-4'>
          <h1 className='text-2xl font-bold mb-6'>Join a Room</h1>
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleJoin}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className='w-full max-w-2xl mx-auto'>
          <h1 className='mb-4 font-bold text-2xl'>Room: {room}</h1>
          <div className='h-[500px] overflow-y-auto p-4 mb-4 bg-gray-100 border border-gray-300 rounded-2xl shadow-inner'>
            {messages.map((msg, index) => (
              msg.sender === "System" ? (
                <div key={index} className="text-center text-white bg-gray-800 px-4 py-1 rounded-full mb-3 text-sm w-fit mx-auto shadow">
                  {msg.message}
                </div>
              ) : (
                <ChatMessage
                  key={index}
                  sender={msg.sender}
                  message={msg.message}
                  isOwnMessage={msg.isOwnMessage}
                />
              )
            ))}
            <div ref={messagesEndRef} />
            {typingUser && (
              <p className="text-sm italic text-gray-500 animate-pulse mt-2">
                {typingUser} is typing...
              </p>
            )}
          </div>
          <Chatform onSendMessage={handleSendMessage} room={room} userName={userName} />
        </div>
      )}
    </div>
  )
}

export default ChatBox
