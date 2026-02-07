import { useState, useRef, useEffect } from "react";
import { X, Mic, MicOff, Send, Keyboard, ChevronUp } from "lucide-react";
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
  const [showTextInput, setShowTextInput] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = () => {
    const msg = showTextInput ? input : voiceInput;
    if (!msg.trim()) return;
    sendChat(msg);
    setInput("");
    setVoiceInput("");
  };

  const handleVoiceSend = () => {
    if (!voiceInput.trim()) return;
    sendChat(voiceInput);
    setVoiceInput("");
  };

  return (
    <div className="onboarding-screen relative flex flex-col h-screen overflow-hidden">
      <div className="onboarding-glow" />

      {/* Header */}
      <div className="relative z-10 pt-6 px-6 flex items-center gap-3">
        <button
          onClick={() => setCurrentView("calendar")}
          className="w-10 h-10 rounded-full flex items-center justify-center onboarding-btn-secondary transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium onboarding-question">AI Coach</h2>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5">
        {chatHistory.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full">
            <p className="text-center text-lg onboarding-transcript max-w-xs leading-relaxed">
              Ask me to adjust your plan, change workout times, or modify intensity
            </p>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] px-4 py-3 rounded-2xl mb-3 leading-relaxed text-[15px] ${
                msg.role === "user" ? "ml-auto" : ""
              }`}
              style={
                msg.role === "user"
                  ? { background: "hsl(0 0% 100% / 0.25)", color: "hsl(0 0% 100%)" }
                  : { background: "hsl(0 0% 100% / 0.12)", color: "hsl(0 0% 100% / 0.9)" }
              }
            >
              {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 pb-8 px-6">
        {/* Text input panel */}
        {showTextInput && (
          <div className="max-w-lg mx-auto mb-4 animate-fade-in">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                autoFocus
                className="flex-1 p-3 px-4 rounded-xl text-base outline-none onboarding-textarea"
              />
              <button
                onClick={handleSend}
                className="w-12 h-12 rounded-xl flex items-center justify-center onboarding-btn-continue transition-all active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Helper text */}
        <p className="text-center text-sm mb-4 onboarding-helper">
          {chatHistory.length === 0 ? "Tap the mic and speak your feedback" : "Speak or type to adjust your plan"}
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          {/* Mic button */}
          <button
            onClick={toggleListening}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isListening ? "onboarding-btn-recording" : "onboarding-btn-mic"
            }`}
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full onboarding-btn-recording animate-pulse-ring" />
            )}
            {isListening ? (
              <MicOff className="w-5 h-5 relative z-10" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Audio bars indicator */}
          {isListening && (
            <div className="flex items-end gap-[3px] h-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full onboarding-bar"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}

          {/* Send voice input */}
          {voiceInput && !showTextInput && (
            <button
              onClick={handleVoiceSend}
              className="w-14 h-14 rounded-full flex items-center justify-center onboarding-btn-continue transition-all active:scale-95"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          {/* Keyboard toggle */}
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              showTextInput ? "onboarding-btn-active" : "onboarding-btn-secondary"
            }`}
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
