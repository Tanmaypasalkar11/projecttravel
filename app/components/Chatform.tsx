"use client";
import React, { useState } from "react";

const Chatform = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full gap-2 items-center mt-3"
    >
      <input
        type="text"
        value={message}
        placeholder="Type your message here..."
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium"
      >
        Send
      </button>
    </form>
  );
};

export default Chatform;
