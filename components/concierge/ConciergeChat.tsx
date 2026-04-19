"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { MOCK_TICKET } from "@/lib/mock-data";

interface Message {
  role: "user" | "concierge";
  content: string;
}

export default function ConciergeChat({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: "concierge", content: "Hi! How can I help you navigate the stadium today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { densities } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat (guarded for test environments)
  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Wait for animate-out
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newMessages = [...messages, { role: "user" as const, content: trimmedInput }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedInput,
          location: MOCK_TICKET.stand,
          liveData: densities,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessages([...newMessages, { role: "concierge", content: data.text }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "concierge", content: "Sorry, I can't reach the network right now. Try again shortly." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`fixed bottom-20 right-4 w-72 sm:w-80 bg-bg1 text-fg0 rounded-2xl shadow-2xl border border-bg2 flex flex-col z-[100] transform transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}
      role="dialog"
      aria-label="Concierge Chat"
      aria-modal="false" // non-modal since they can still interact with map
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-bg2 bg-bg2 rounded-t-2xl shrink-0">
        <h3 className="font-heading font-bold text-sm tracking-wide uppercase text-fg1 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">🏟️</span>
          Concierge
        </h3>
        <button 
          onClick={handleClose} 
          className="text-fg2 hover:text-fg0 focus:ring-2 focus:ring-orange rounded-full p-1"
          aria-label="Close Chat"
        >
          ✕
        </button>
      </div>

      {/* Message Log */}
      <div 
        className="flex-1 p-4 overflow-y-auto min-h-[250px] max-h-[400px] flex flex-col gap-3 font-body text-[14px]"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl ${
                m.role === "user" 
                  ? "bg-orange text-bg0 rounded-br-[4px]" 
                  : "bg-bg3 text-fg0 rounded-bl-[4px]"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start" aria-label="Concierge is typing...">
            <div className="bg-bg3 text-fg2 p-3 rounded-2xl rounded-bl-[4px] flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce delay-100">•</span>
              <span className="animate-bounce delay-200">•</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t border-bg2 flex gap-2 bg-bg1 rounded-b-2xl shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 bg-bg2 text-fg0 border border-bg3 rounded-full px-4 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-orange placeholder:text-fg3"
          aria-label="Message Input"
          disabled={isLoading}
          /* autoFocus is explicitly omitted to not steal focus on page load if opened programmatically later,
             but since it's a FAB click, we can autofocus it on mount. */
          autoFocus 
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-full bg-orange text-bg0 flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg1 focus:ring-orange disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send Message"
        >
          ↑
        </button>
      </form>
    </div>
  );
}
