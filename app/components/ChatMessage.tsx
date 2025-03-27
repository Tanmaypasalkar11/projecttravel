import React from "react";
import { ChatMessageProps } from "../types/ChatMessage";

const ChatMessage = ({ sender, message, isOwnMessage }: ChatMessageProps) => {
  const isSystemMessage = sender === "System";

  return (
    <div
      className={`flex ${
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "justify-start"
      } mb-3`}
    >
      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isSystemMessage
            ? "bg-gray-800 text-white text-center text-xs"
            : isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-white text-black border"
        }`}
      >
        {!isSystemMessage && (
          <p className="text-xs text-gray-500 mb-1">{sender}</p>
        )}
        <p className="text-sm break-words">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
