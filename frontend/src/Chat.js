import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./chat.css";

export default function Chat({ visible, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [typing, setTyping] = useState(false);

  const bodyRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage() {
    if (!input.trim()) return;
    
    const userText = input;
    setInput("");
    
    console.log("Sending message:", userText);
    
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setMessages(prev => [
      ...prev,
      { role: "assistant", text: "", streaming: true }
    ]);
    
    setTyping(true);

    try {
      // ----------------
      // START
      // ----------------
      if (!conversationId) {
        console.log("Starting new conversation...");
        
        const res = await fetch("http://127.0.0.1:8000/api/chat/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText })
        });
        
        if (!res.ok) {
          const error = await res.text();
          console.error("Start failed:", error);
          throw new Error("Start failed");
        }
        
        const data = await res.json();
        console.log("Conversation started:", data);
        
        setConversationId(data.conversationId);
        
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            text: data.reply,
            streaming: false
          };
          return updated;
        });
        
        setTyping(false);
        return;
      }

      // ----------------
      // CONTINUE (STREAM)
      // ----------------
      console.log("Continuing conversation:", conversationId);
      
      const res = await fetch("http://127.0.0.1:8000/api/chat/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          conversationId: conversationId
        })
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Continue failed:", error);
        throw new Error("Continue failed");
      }

      console.log("Reading stream...");

      // Read the stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log("Stream done");
          setTyping(false);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // Split by newlines to process complete SSE messages
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log("Received chunk:", data);
              
              if (data.content) {
                setMessages(prev => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  updated[updated.length - 1] = {
                    ...lastMsg,
                    text: lastMsg.text + data.content
                  };
                  return updated;
                });
              }
              
              if (data.error) {
                console.error("Stream error:", data.error);
                setTyping(false);
              }
            } catch (e) {
              console.error("Parse error:", e, "Line:", line);
            }
          }
        }
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].streaming = false;
        return updated;
      });

    } catch (err) {
      console.error("Send error:", err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: "Sorry, an error occurred. Please try again.",
          streaming: false
        };
        return updated;
      });
      setTyping(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">Loan Assistant</div>
        <div className="chat-actions">
          <button
            className="new-btn"
            onClick={() => {
              console.log("Resetting conversation");
              setMessages([]);
              setConversationId(null);
            }}
          >
            New
          </button>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <ReactMarkdown>{m.text || " "}</ReactMarkdown>
          </div>
        ))}

        {typing && (
          <div className="msg assistant">
            <div className="typing typing-colorful">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about loans..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={!input.trim() || typing}>➤</button>
      </div>
    </div>
  );
}