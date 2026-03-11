"use client";

import { ChatSidebar } from "@ui/components/chat-sidebar";
import { ChatInterface, SavedChat } from "@ui/core/chat/ChatInterface";
import { MobileChatHeader } from "@ui/components/mobile-chat-header";
import { MobileChatDrawer } from "@ui/components/mobile-chat-drawer";
import { useState, useEffect } from "react";
import { Message } from "ai";

export default function AskPage() {
  const [model, setModel] = useState("gpt-4o-mini");
  const [temperature, setTemperature] = useState(0.7);
  const [chatKey, setChatKey] = useState(Date.now());
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // This effect ensures the active chat is properly set on page load
  useEffect(() => {
    const storedActiveChat = localStorage.getItem("fixfx-current-chat");
    if (storedActiveChat) {
      // If there's an active chat stored, load it
      const savedChatsStr = localStorage.getItem("fixfx-chats");
      if (savedChatsStr) {
        try {
          const savedChats: SavedChat[] = JSON.parse(savedChatsStr);
          const activeChat = savedChats.find(
            (chat) => chat.id === storedActiveChat,
          );
          if (activeChat) {
            console.log("[AskPage] Loading stored active chat:", activeChat.id);
            setModel(activeChat.model);
            setTemperature(activeChat.temperature);
            setInitialMessages(activeChat.messages);
          }
        } catch (error) {
          console.error("Error loading stored active chat:", error);
        }
      }
    }
  }, []);

  // Clean up duplicates and fix chat selection
  useEffect(() => {
    const cleanupStoredChats = () => {
      try {
        const savedChatsStr = localStorage.getItem("fixfx-chats");
        if (savedChatsStr) {
          const savedChats: SavedChat[] = JSON.parse(savedChatsStr);

          // Deduplicate by ID first
          const uniqueChatsById = new Map();
          savedChats.forEach((chat) => uniqueChatsById.set(chat.id, chat));

          // Further deduplicate by content if needed
          const uniqueChatsByContent = new Map();
          for (const chat of uniqueChatsById.values()) {
            const firstUserMsg = chat.messages.find((m) => m.role === "user");
            if (firstUserMsg) {
              const key = firstUserMsg.content;
              if (
                !uniqueChatsByContent.has(key) ||
                uniqueChatsByContent.get(key).messages.length <
                  chat.messages.length
              ) {
                uniqueChatsByContent.set(key, chat);
              }
            } else {
              // Keep chats without user messages (welcome only)
              uniqueChatsByContent.set(chat.id, chat);
            }
          }

          // Convert back to array and store
          const deduplicatedChats = Array.from(uniqueChatsByContent.values());
          localStorage.setItem(
            "fixfx-chats",
            JSON.stringify(deduplicatedChats),
          );

          // Notify components that chats have been updated
          window.dispatchEvent(new CustomEvent("chatsUpdated"));
        }
      } catch (error) {
        console.error("Error cleaning up saved chats:", error);
      }
    };

    cleanupStoredChats();

    // Also clean up whenever chats update, to catch any new duplicates
    const handleChatsUpdated = () => setTimeout(cleanupStoredChats, 100); // Small delay to ensure storage is updated first
    window.addEventListener("chatsUpdated", handleChatsUpdated);
    return () => {
      window.removeEventListener("chatsUpdated", handleChatsUpdated);
    };
  }, []);

  const handleLoadChat = (chat: SavedChat) => {
    // First update localStorage and dispatch event
    localStorage.setItem("fixfx-current-chat", chat.id);
    window.dispatchEvent(new CustomEvent("activeChatChanged"));

    // Then update UI state
    setModel(chat.model);
    setTemperature(chat.temperature);
    setInitialMessages(chat.messages);
    setChatKey(Date.now());
    setMobileDrawerOpen(false);

    console.log("[AskPage] Loaded chat:", chat.id);
  };

  const handleNewChat = () => {
    // First clear localStorage and dispatch event
    localStorage.removeItem("fixfx-current-chat");
    window.dispatchEvent(new CustomEvent("activeChatChanged"));

    // Then update UI
    setInitialMessages([]);
    setChatKey(Date.now());
    setMobileDrawerOpen(false);

    console.log("[AskPage] Started new chat");
  };

  return (
    <div className="relative flex min-h-screen h-screen bg-fd-background overflow-hidden">
      {/* Desktop layout */}
      <div className="hidden md:flex w-full h-full">
        <ChatSidebar
          model={model}
          temperature={temperature}
          onModelChange={setModel}
          onTemperatureChange={setTemperature}
          onLoadChat={handleLoadChat}
          onNewChat={handleNewChat}
        />
        <main className="flex-1 h-full flex flex-col">
          <ChatInterface
            key={chatKey}
            initialMessages={initialMessages}
            model={model}
            temperature={temperature}
            fullHeight
          />
        </main>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col w-full h-full md:hidden overflow-hidden">
        <MobileChatHeader
          onMenuClick={() => setMobileDrawerOpen(true)}
          model={model}
          temperature={temperature}
        />
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <ChatInterface
            key={chatKey}
            initialMessages={initialMessages}
            model={model}
            temperature={temperature}
            fullHeight
          />
        </main>
        <MobileChatDrawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          model={model}
          temperature={temperature}
          onModelChange={setModel}
          onTemperatureChange={setTemperature}
          onLoadChat={handleLoadChat}
          onNewChat={handleNewChat}
        />
      </div>
    </div>
  );
}
