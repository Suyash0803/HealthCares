import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat/res", {
        messages: updatedMessages,
      });
      setMessages([...updatedMessages, res.data.reply]);
    } catch (err) {
      console.error("Chat error", err);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-grow bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chat with Groq</h2>
              <p className="text-xs text-gray-600">
                Powered by AI technology
              </p>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Start a conversation
              </h3>
              <p className="text-sm text-gray-700 max-w-md">
                Ask me anything or share your thoughts. I'm here to help with
                your questions!
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex max-w-[85%] ${
                msg.role === "user" ? "ml-auto justify-end" : "mr-auto"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm transition-all duration-200 ${
                  msg.role === "user"
                    ? "bg-gray-900 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.content}
                <div
                  className={`text-xs mt-1 ${
                    msg.role === "user" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {msg.role === "user" ? "You" : "Assistant"}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex mr-auto max-w-[85%]">
              <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-100 text-gray-900">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-600 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-600 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 px-4 py-3 bg-white">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className={`flex items-center justify-center h-11 w-11 rounded-xl ${
                isLoading || !input.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800"
              } text-white transition-all shadow-md`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Groq may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;