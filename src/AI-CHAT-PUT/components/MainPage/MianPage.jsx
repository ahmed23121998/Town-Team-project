import React, { useState, useRef, useEffect, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

import { AIContext } from "../../context/aiTownteam.jsx";
import { MyContext } from "../../../Context/FilterContaext.js";

export default function MainPage({ toggleChatDrawer }) {
  const { position } = useContext(MyContext);
  const { onsentMessage } = useContext(AIContext);
  const [messages, setMessages] = useState([
    {
      text:
        position === "left"
          ? "Hello! Welcome to Town Team! I'm your personal AI shopping assistant, here to help you explore our latest men’s and kids’ collections, find the best deals, and answer any questions. Whether you need help with sizing, filtering products, or tracking your order, feel free to ask—I'm available 24/7! How can I assist you today?"
          : "هاى ! مرحبا بك في تاون تيم! أنا مساعدك الشخصي للتسوق بالذكاء الاصطناعي، هنا لمساعدتك في استكشاف أحدث مجموعات الرجال والأطفال، والعثور على أفضل العروض، والإجابة على أي أسئلة. سواء كنت بحاجة إلى مساعدة في المقاسات، أو تصفية المنتجات، أو تتبع طلبك، فلا تتردد في السؤال - أنا متاح على مدار الساعة طوال أيام الأسبوع! كيف يمكنني مساعدتك اليوم؟",
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await onsentMessage(userMessage.text);
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          text: err + "Sorry, something went wrong. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#242526",
        height: "99vh",
        width: "60vw",
        maxWidth: 820,
        minWidth: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        overflowX: "hidden",
        // textAlign: "left",
        direction: position === "right" ? "ltr" : " rtl",
        textAlign: position === "left" ? "right" : "left",
        // direction: position === "right" ? "rtl" : "ltr",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#242526",
          color: "#fff",
          padding: "1rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          fontSize: 40,
          position: "relative",
        }}
      >
        <IconButton
          onClick={toggleChatDrawer(false)}
          sx={{
            bgcolor: "#18191A",
            color: "white",
            position: "absolute",
            left: 0,
            top: 14,
          }}
        >
          <CloseIcon />
        </IconButton>
        <span style={{ background: "#ffc300", color: "black", marginLeft: 10 }}>
          {position === "left" ? "Town Team " : "Town Team"}
        </span>
        {position === "left" ? "AI CHAT" : "AI CHAT"}
        {/* AI Chat */}
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 820,
          flex: 1,
          background: "#242526",
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.7rem",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.isUser ? "flex-end" : "flex-start",
              background: message.isUser ? "#ffc300" : "#3A3B3C",
              color: message.isUser ? "#18191A" : "#fff",
              padding: "1.1rem 1.4rem",
              borderRadius: message.isUser
                ? "18px 18px 4px 18px"
                : "18px 18px 18px 4px",
              maxWidth: "95%",
              marginBottom: 14,
              boxShadow: message.isUser
                ? "0 2px 12px rgba(255,195,0,0.13)"
                : "0 2px 12px rgba(0,0,0,0.10)",
              fontSize: 17,
              lineHeight: 1.7,
              whiteSpace: "pre-line",
              wordBreak: "break-word",
              border: message.isUser
                ? "1.5px solid #ffc300"
                : "1.5px solid #3A3B3C",
              transition: "background 0.2s, border 0.2s",
            }}
          >
            {message.text.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block", marginBottom: 6 }}>
                {line.replace(/\*/g, "")}
              </span>
            ))}
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#3A3B3C",
              color: "#fff",
              padding: "0.7rem 1rem",
              borderRadius: 16,
              maxWidth: "80%",
            }}
          >
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        style={{
          width: "100%",
          maxWidth: 820,
          background: "#242526",
          // padding: "0.7rem 1rem",s
          // borderBottomLeftRadius: 12,
          // borderBottomRightRadius: 12,
          display: "flex",
          gap: 8,
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            position === "left" ? "Type your message..." : "اكتب رسالتك..."
          }
          style={{
            flex: 1,
            padding: "0.7rem 1rem",
            borderRadius: 20,
            border: "none",
            outline: "none",
            fontSize: 16,
            background: "#3A3B3C",
            color: "#fff",
            minWidth: 0,
            minHeight: 40,
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            background: "#ffc300",
            color: "#18191A",
            border: "none",
            borderRadius: 50,
            padding: "0.7rem 1.5rem",
            fontWeight: "bold",
            fontSize: 16,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            minHeight: "80px",

            transition: "background 0.2s, color 0.2s",
          }}
        >
          {position === "left" ? "Send" : "إرسال"}
        </button>
      </form>
      <style>{`
        @media (max-width: 900px) {
          div[style*='width: 60vw'] {
            width: 100vw !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            height: 100vh !important;
          }
          div[style*='font-size: 40px'] {
            font-size: 28px !important;
            padding: 0.7rem !important;
            height: 56px !important;
          }
          form[style*='max-width: 820px'] {
            max-width: 100vw !important;
            padding: 0.5rem !important;
            gap: 6px !important;
          }
          input[type="text"] {
            font-size: 15px !important;
            padding: 0.5rem 0.8rem !important;
            min-height: 36px !important;
          }
          button[type="submit"] {
            font-size: 15px !important;
            padding: 0.5rem 1.1rem !important;
            min-height: 36px !important;
            min-width: 60px !important;
          }
        }
        @media (max-width: 600px) {
          div[style*='width: 60vw'] {
            width: 100vw !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            height: 100vh !important;
          }
          div[style*='font-size: 40px'] {
            font-size: 20px !important;
            padding: 0.5rem !important;
            height: 44px !important;
          }
          form[style*='max-width: 820px'] {
            max-width: 100vw !important;
            padding: 0.3rem !important;
            gap: 4px !important;
          }
          input[type="text"] {
            font-size: 13px !important;
            padding: 0.4rem 0.6rem !important;
            min-height: 32px !important;
          }
          button[type="submit"] {
            font-size: 13px !important;
            padding: 0.4rem 0.8rem !important;
            min-height: 32px !important;
            min-width: 50px !important;
          }
        }
        @media (max-width: 400px) {
          div[style*='font-size: 40px'] {
            font-size: 16px !important;
            padding: 0.3rem !important;
            height: 36px !important;
          }
          input[type="text"] {
            font-size: 11px !important;
            padding: 0.2rem 0.4rem !important;
            min-height: 28px !important;
          }
          button[type="submit"] {
            font-size: 11px !important;
            padding: 0.2rem 0.5rem !important;
            min-height: 28px !important;
            min-width: 40px !important;
          }
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        div[style*='overflowY: auto']::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
