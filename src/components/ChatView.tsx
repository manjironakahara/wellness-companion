import { useState, useRef, useEffect } from "react";
import { X, Mic, Send } from "lucide-react";
import type { ChatMessage, AppView } from "@/hooks/useAppState";

interface ChatViewProps {
  chatHistory: ChatMessage[];
  sendChat: (msg: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  setCurrentView: (view: AppView) => void;
}

const ChatView = ({ chatHistory, sendChat, isListening, toggleListening, setCurrentView }: ChatViewProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChat(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-card">
      {/* Header */}
      <div className="gradient-header text-primary-foreground px-5 py-5 flex items-center gap-3">
        <button
          onClick={() => setCurrentView("calendar")}
          className="p-0 bg-transparent"
        >
          <X className="w-6 h-6 text-primary-foreground" />
        </button>
        <h2 className="text-xl font-medium">Chat with AI Coach</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {chatHistory.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground/60">
            Ask me to adjust your plan, change workout times, or modify intensity
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] px-4 py-3 rounded-2xl mb-3 leading-relaxed text-[15px] ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-5 py-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your feedback..."
          className="flex-1 px-4 py-3 border border-input rounded-xl text-base outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={toggleListening}
          className={`p-3 rounded-xl transition-all ${
            isListening ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          className="px-5 py-3 rounded-xl bg-foreground text-card font-medium transition-all active:scale-[0.98]"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatView;
