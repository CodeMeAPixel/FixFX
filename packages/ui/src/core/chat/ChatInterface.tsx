"use client";

import { useChat } from "ai/react";
import { Button } from "@ui/components";
import { ScrollArea } from "@ui/components/scroll-area";
import { cn } from "@utils/functions/cn";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  AlertCircle,
  X,
  Copy,
  Check,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message } from "ai";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { motion, AnimatePresence } from "motion/react";

interface ChatInterfaceProps {
  model: string;
  temperature: number;
  initialMessages?: Message[];
  fullHeight?: boolean;
}

export interface SavedChat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  temperature: number;
  timestamp: number;
  preview: string;
}

export function ChatInterface({
  model,
  temperature,
  initialMessages,
  fullHeight = false,
}: ChatInterfaceProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      model,
      temperature,
    },
    initialMessages,
  });
  const [showNotice, setShowNotice] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isExistingChat, setIsExistingChat] = useState(false);

  // Reference to track if we've already saved this message set
  const savedMessagesRef = useRef<Message[]>([]);

  // Add a ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea as content grows
  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        const form = e.currentTarget.closest("form");
        if (form) form.requestSubmit();
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || !input.trim()) return;
    const byok =
      typeof window !== "undefined"
        ? {
            openai: localStorage.getItem("fixfx-byok-openai") || undefined,
            anthropic:
              localStorage.getItem("fixfx-byok-anthropic") || undefined,
            google: localStorage.getItem("fixfx-byok-google") || undefined,
          }
        : {};
    handleSubmit(e, { body: { byok } });
  };

  // Skip initial setup if we're loading an existing chat
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      // For existing chats, ensure we keep the current chat ID
      const existingChatId = localStorage.getItem("fixfx-current-chat");
      if (existingChatId && currentChatId !== existingChatId) {
        setCurrentChatId(existingChatId);
        setIsExistingChat(true);

        // Make sure we preserve the timestamps from the saved messages
        // by using the initialMessages directly instead of recreating them
        savedMessagesRef.current = [...initialMessages];
        console.log("[ChatInterface] Using existing chat ID:", existingChatId);
      }
      return;
    } else if (!isExistingChat) {
      // For new chats, clear the active chat ID if it wasn't already cleared
      if (localStorage.getItem("fixfx-current-chat")) {
        localStorage.removeItem("fixfx-current-chat");
        console.log("[ChatInterface] New chat, cleared active chat ID");
      }
    }

    if (messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          role: "assistant",
          content:
            "Hello! I'm **Fixie**, your AI assistant for the CitizenFX ecosystem.\n\nI can help you with:\n- **FiveM & RedM** server setup and configuration\n- **Scripting** in Lua, JavaScript, and C#\n- **Framework** questions (ESX, QBCore, etc.)\n- **Troubleshooting** common errors and issues\n\nHow can I assist you today?",
          createdAt: new Date(),
        },
      ]);
    }
  }, [
    initialMessages,
    setMessages,
    isExistingChat,
    currentChatId,
    messages.length,
  ]);

  // Fix the chat saving effect
  useEffect(() => {
    // Skip if nothing changed
    if (messages.length <= 1) return;
    if (isExistingChat && messages.length === initialMessages?.length) return;

    // Skip if we've already saved these exact messages
    if (JSON.stringify(messages) === JSON.stringify(savedMessagesRef.current)) {
      return;
    }

    // Capture user message for title
    const firstUserMessage = messages.find((m) => m.role === "user");
    if (!firstUserMessage) return;

    console.log(
      "[ChatInterface] Saving chat, messages length:",
      messages.length,
    );

    // Update our saved reference
    savedMessagesRef.current = [...messages];

    // Continue with the rest of chat saving logic...
    let chatId = currentChatId;
    if (!chatId) {
      chatId = uuidv4();
      setCurrentChatId(chatId);
      console.log("[ChatInterface] New chat created with ID:", chatId);
    }

    const title = firstUserMessage.content
      .split(/[.!?]/)[0] // Take the first sentence or phrase
      .trim() // Remove extra spaces
      .slice(0, 30) // Limit to 30 characters
      .concat(firstUserMessage.content.length > 30 ? "..." : ""); // Add ellipsis if truncated

    // Ensure all messages have timestamps
    const messagesWithTimestamps = messages.map((msg) => ({
      ...msg,
      // Preserve existing timestamp or createdAt, or create a new one
      timestamp:
        msg.timestamp || (msg.createdAt ? msg.createdAt.getTime() : Date.now()),
    }));

    const chatToSave: SavedChat = {
      id: chatId,
      title,
      messages: messagesWithTimestamps,
      model,
      temperature,
      timestamp: Date.now(),
      preview: firstUserMessage.content,
    };

    const existingChatsStr = localStorage.getItem("fixfx-chats");
    let existingChats: SavedChat[] = [];

    try {
      if (existingChatsStr) {
        existingChats = JSON.parse(existingChatsStr);
      }

      const chatIndex = existingChats.findIndex((chat) => chat.id === chatId);
      const contentMatchIndex = existingChats.findIndex((chat) => {
        const firstUserMsg = chat.messages.find((m) => m.role === "user");
        return (
          firstUserMsg && firstUserMsg.content === firstUserMessage.content
        );
      });

      if (chatIndex === -1 && contentMatchIndex >= 0) {
        chatId = existingChats[contentMatchIndex].id;
        setCurrentChatId(chatId);
      }

      const indexToUpdate = chatIndex >= 0 ? chatIndex : contentMatchIndex;

      if (indexToUpdate >= 0) {
        existingChats[indexToUpdate] = chatToSave;

        if (indexToUpdate > 0) {
          existingChats = [
            existingChats[indexToUpdate],
            ...existingChats.slice(0, indexToUpdate),
            ...existingChats.slice(indexToUpdate + 1),
          ];
        }
      } else {
        existingChats = [chatToSave, ...existingChats];
      }

      // Keep only the most recent 20 chats
      const updatedChats = existingChats.slice(0, 20);
      localStorage.setItem("fixfx-chats", JSON.stringify(updatedChats));
      localStorage.setItem("fixfx-current-chat", chatId);

      // Dispatch event only once per save, with a small delay
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("chatsUpdated"));
      }, 10);
    } catch (error) {
      console.error("Error handling chat save:", error);
    }
  }, [
    messages,
    model,
    temperature,
    isExistingChat,
    initialMessages,
    currentChatId,
  ]);

  // Add a scroll to bottom function with enhanced behavior
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  // Improved effect to scroll when messages change
  useEffect(() => {
    // First immediate scroll without animation for initial position
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: "end" });
    }

    // Then smooth scroll with a delay to ensure DOM updates are complete
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // Improved resize handler for mobile
  useEffect(() => {
    const handleResize = () => {
      // On mobile, ensure content is visible when keyboard opens/closes
      if (window.innerWidth < 768) {
        // Set a short delay to let keyboard animation finish
        setTimeout(() => {
          // Force scroll to bottom
          messagesEndRef.current?.scrollIntoView({
            block: "end",
            behavior: "auto",
          });

          // For iOS specifically, sometimes we need an extra scroll
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            setTimeout(scrollToBottom, 300);
          }
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add an effect to focus the input field when a new chat is started
  useEffect(() => {
    const inputElement = document.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;
    if (inputElement && messages.length <= 1) {
      inputElement.focus();
    }
  }, [messages.length]);

  const formatTimestamp = (timestamp: number | undefined) => {
    // If timestamp is undefined or invalid, use current time as fallback
    const messageDate =
      timestamp && !isNaN(timestamp) ? new Date(timestamp) : new Date();

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeStr = messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (messageDate.toDateString() === now.toDateString()) {
      return `Today at ${timeStr}`;
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${timeStr}`;
    } else {
      const dateStr = messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          messageDate.getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
      });
      return `${dateStr} at ${timeStr}`;
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderMessageContent = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");
            const isBlock = !!(match || code.includes("\n"));

            if (isBlock && language) {
              return (
                <div className="relative group my-4 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-800 px-4 py-1 text-xs font-mono text-gray-300">
                    <span>{language}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={() => handleCopyCode(code)}
                    >
                      {copiedCode === code ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: "0px",
                      padding: "1rem",
                    }}
                    wrapLongLines={true}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return (
              <code
                className="bg-gray-800/50 px-1 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-6 mb-4">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-6 mb-4">{children}</ol>;
          },
          li({ children }) {
            return <li className="mb-1">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-md font-bold mb-2 mt-3">{children}</h3>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-gray-500 pl-4 italic my-2">
                {children}
              </blockquote>
            );
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5865F2] hover:underline"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse border border-gray-700">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-700 bg-gray-800 px-4 py-2 text-left">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-gray-700 px-4 py-2">{children}</td>
            );
          },
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto my-2 rounded"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div
      ref={chatContainerRef}
      className={cn(
        "flex flex-col w-full bg-fd-background/80 backdrop-blur-sm relative",
        fullHeight ? "h-full" : "h-[calc(100vh-12rem)]",
        "overflow-hidden",
      )}
    >
      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent relative z-30"
          >
            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 mt-0.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-medium text-amber-500">
                      AI responses may be inaccurate
                    </h4>
                    <p className="text-xs text-fd-muted-foreground leading-relaxed">
                      Always verify with{" "}
                      <a
                        href="https://docs.fivem.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5865F2] hover:underline"
                      >
                        official docs
                      </a>{" "}
                      or{" "}
                      <a
                        href="/docs/core"
                        className="text-[#5865F2] hover:underline"
                      >
                        our guides
                      </a>{" "}
                      before production use.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0 text-fd-muted-foreground hover:text-fd-foreground"
                  onClick={() => setShowNotice(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ScrollArea
          className="flex-1 p-3 sm:p-4 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="space-y-4 mb-4 pb-2 max-w-7xl mx-auto w-full px-2">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index === messages.length - 1 ? 0.1 : 0,
                }}
                className={cn(
                  "flex gap-2 sm:gap-3 min-w-0",
                  message.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                    message.role === "user"
                      ? "bg-[#5865F2]"
                      : "bg-gradient-to-br from-[#5865F2] to-purple-600",
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Message content */}
                <div
                  className={cn(
                    "flex flex-col gap-1 min-w-0 max-w-[85%] sm:max-w-[calc(100%-3rem)]",
                    message.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 break-words min-w-0 w-full",
                      message.role === "user"
                        ? "bg-[#5865F2] text-white rounded-tr-sm overflow-hidden"
                        : "bg-fd-muted/50 border border-fd-border text-fd-foreground rounded-tl-sm overflow-x-auto",
                    )}
                  >
                    {renderMessageContent(message.content)}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">
                    {formatTimestamp(
                      message.timestamp || message.createdAt?.getTime(),
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#5865F2] to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-fd-muted/50 border border-fd-border">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-fd-border bg-fd-background/90 backdrop-blur-md sticky bottom-0 z-40">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-end gap-2 p-3 sm:p-4 max-w-7xl mx-auto w-full px-2"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                handleInputChange(e);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask Fixie about FiveM, RedM, txAdmin..."
              className="w-full bg-fd-muted/30 border border-fd-border focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2]/20 rounded-xl text-sm resize-none overflow-hidden min-h-[40px] max-h-[120px] sm:max-h-[160px] px-3 py-2 leading-[1.5] placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
              rows={1}
              style={{ height: "40px" }}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl transition-all flex-shrink-0",
              input.trim()
                ? "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white shadow-lg shadow-[#5865F2]/20"
                : "bg-fd-muted text-muted-foreground",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
