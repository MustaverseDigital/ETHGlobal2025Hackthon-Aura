"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import axios from "axios"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatBotProps {
  gemId: number
  gemName: string
  gemType: string
  gemCut: string
  gemValue: number
}

export default function ChatBot({ gemId, gemName, gemType, gemCut, gemValue }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. Feel free to ask me any questions about your loan receipt or the diamond's 4C characteristics (Cut, Color, Clarity, and Carat)."
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Include gem details in the input text for context
      const contextEnrichedInput = `
        Context - Gem Details:
        ID: ${gemId}
        Name: ${gemName}
        Type: ${gemType}
        Cut: ${gemCut}
        Value: ${gemValue} USDC
        
        User Question: ${userMessage}
      `

      const response = await axios.post("https://temp-server-tjtz.onrender.com/defiInfo", {
        input_text: contextEnrichedInput
      })

      setMessages(prev => [...prev, { role: "assistant", content: JSON.stringify(response.data.result) }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble connecting to the server. Please try again later." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="h-[700px] flex flex-col bg-white/10 backdrop-blur-md border-none">
      <CardHeader className="shrink-0 pb-4">
        <CardTitle className="text-white">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-700 text-gray-100">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2 shrink-0 pt-4 mt-4 border-t border-white/10">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-white/10 border-emerald-500/30 text-white placeholder:text-gray-400"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 