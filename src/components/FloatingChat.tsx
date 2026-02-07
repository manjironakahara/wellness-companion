import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Keyboard, X, MessageCircle } from "lucide-react";
import type { ChatMessage } from "@/hooks/useAppState";
import { useChatSpeech } from "@/hooks/useChatSpeech";

interface FloatingChatProps {
  chatHistory: ChatMessage[];
  sendChat: (msg: string) => void;
}

const FloatingChat = ({ chatHistory, sendChat }: FloatingChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, toggleListening, clearTranscript, supported } = useChatSpeech();
  const wasListeningRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen]);

  // Auto-send when voice recording stops and there's a transcript
  useEffect(() => {
    if (wasListeningRef.current && !isListening && transcript.trim()) {
      sendChat(transcript.trim());
      clearTranscript();
    }
    wasListeningRef.current = isListening;
  }, [isListening, transcript, sendChat, clearTranscript]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChat(input);
    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg"
        style={{
          background: "hsl(0 0% 100% / 0.9)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <MessageCircle className="w-6 h-6 text-primary" />
        {chatHistory.length > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: "hsl(0 84% 60%)", color: "white" }}
          >
            {chatHistory.filter(m => m.role === "assistant").length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
      style={{
        maxHeight: "70vh",
        background: "hsl(174 65% 42% / 0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid hsl(0 0% 100% / 0.15)",
        borderRadius: "20px 20px 0 0",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.1)" }}>
        <h3 className="text-base font-medium onboarding-question">AI Coach</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: "hsl(0 0% 100% / 0.15)" }}
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ minHeight: "120px", maxHeight: "45vh" }}>
        {chatHistory.length === 0 ? (
          <p className="text-center text-sm py-6 onboarding-helper">
            Ask me to adjust your plan, change times, or modify intensity
          </p>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                msg.role === "user" ? "ml-auto" : ""
              }`}
              style={
                msg.role === "user"
                  ? { background: "hsl(0 0% 100% / 0.25)", color: "hsl(0 0% 100%)" }
                  : { background: "hsl(0 0% 100% / 0.1)", color: "hsl(0 0% 100% / 0.9)" }
              }
            >
              {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Live transcript */}
      {isListening && transcript && (
        <div className="px-4 py-2" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.05)" }}>
          <p className="text-sm italic onboarding-transcript">{transcript}</p>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.1)" }}>
        {showTextInput ? (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              autoFocus
              className="flex-1 p-2.5 px-4 rounded-xl text-sm outline-none onboarding-textarea"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full flex items-center justify-center onboarding-btn-continue transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-3">
            {supported && (
              <button
                onClick={toggleListening}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  isListening ? "onboarding-btn-recording" : "onboarding-btn-mic"
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            {isListening && (
              <div className="flex items-end gap-[3px] h-5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[2px] rounded-full onboarding-bar"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setShowTextInput(!showTextInput)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
            showTextInput ? "onboarding-btn-active" : "onboarding-btn-secondary"
          }`}
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
