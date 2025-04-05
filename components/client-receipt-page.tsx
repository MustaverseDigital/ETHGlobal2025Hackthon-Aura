"use client"

import { useState, useEffect } from "react"
import LoanReceipt from "@/components/loan-receipt"
import ChatBot from "@/components/chat-bot"

// Gem data
const gems = [
  {
    id: 1,
    name: "AuraGem #001",
    type: "Ruby",
    cut: "Round Brilliant",
    value: 2.5,
    rate: 0.08,
    color: "#E0115F",
    thumbnail: "https://i.imgur.com/yKYwm5Y.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=0&color=%23ff87b5"
  },
  {
    id: 2,
    name: "AuraGem #002",
    type: "Ruby",
    cut: "Princess Cut",
    value: 2.6,
    rate: 0.08,
    color: "#E0115F",
    thumbnail: "https://i.imgur.com/yKYwm5Y.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=2&color=%23ff87b5"
  },
  {
    id: 3,
    name: "AuraGem #003",
    type: "Ruby",
    cut: "Emerald Cut",
    value: 2.7,
    rate: 0.08,
    color: "#E0115F",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=4&color=%23ff87b5"
  },
  {
    id: 4,
    name: "AuraGem #004",
    type: "Ruby",
    cut: "Oval",
    value: 2.8,
    rate: 0.08,
    color: "#E0115F",
    thumbnail: "https://i.meee.com.tw/WTcDliG.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=6&color=%23ff87b5"
  },
  {
    id: 5,
    name: "AuraGem #005",
    type: "Citrine",
    cut: "Round Brilliant",
    value: 1.8,
    rate: 0.09,
    color: "#E4A300",
    thumbnail: "https://i.meee.com.tw/WTcDliG.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=0&color=%23d5b360"
  },
  {
    id: 6,
    name: "AuraGem #006",
    type: "Citrine",
    cut: "Princess Cut",
    value: 1.9,
    rate: 0.09,
    color: "#E4A301",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=2&color=%23d5b360"
  },
  {
    id: 7,
    name: "AuraGem #007",
    type: "Citrine",
    cut: "Emerald Cut",
    value: 2.0,
    rate: 0.09,
    color: "#E4A302",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=4&color=%23d5b360"
  },
  {
    id: 8,
    name: "AuraGem #008",
    type: "Citrine",
    cut: "Oval",
    value: 2.1,
    rate: 0.09,
    color: "#E4A303",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=6&color=%23d5b360"
  },
  {
    id: 9,
    name: "AuraGem #009",
    type: "Sapphire",
    cut: "Round Brilliant",
    value: 3.0,
    rate: 0.075,
    color: "#0F52BA",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=0&color=%23a2f2b6"
  },
  {
    id: 10,
    name: "AuraGem #010",
    type: "Sapphire",
    cut: "Princess Cut",
    value: 3.1,
    rate: 0.075,
    color: "#0F52BA",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=2&color=%23a2f2b6"
  },
  {
    id: 11,
    name: "AuraGem #011",
    type: "Sapphire",
    cut: "Emerald Cut",
    value: 3.2,
    rate: 0.075,
    color: "#0F52BA",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=4&color=%23a2f2b6"
  },
  {
    id: 12,
    name: "AuraGem #012",
    type: "Sapphire",
    cut: "Oval",
    value: 3.3,
    rate: 0.075,
    color: "#0F52BA",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=6&color=%23a2f2b6"
  },
  {
    id: 13,
    name: "AuraGem #013",
    type: "Emerald",
    cut: "Round Brilliant",
    value: 2.2,
    rate: 0.085,
    color: "#50C878",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=0&color=%23769dff"
  },
  {
    id: 14,
    name: "AuraGem #014",
    type: "Emerald",
    cut: "Princess Cut",
    value: 2.3,
    rate: 0.085,
    color: "#50C879",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=2&color=%23769dff"
  },
  {
    id: 15,
    name: "AuraGem #015",
    type: "Emerald",
    cut: "Emerald Cut",
    value: 2.4,
    rate: 0.085,
    color: "#50C880",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=4&color=%23769dff"
  },
  {
    id: 16,
    name: "AuraGem #016",
    type: "Emerald",
    cut: "Oval",
    value: 2.5,
    rate: 0.085,
    color: "#50C881",
    thumbnail: "https://i.imgur.com/ojyX3Zi.png",
    modelUrl: "https://gemfi-three-js.vercel.app/?modelIndex=6&color=%23769dff"
  }
]

interface ClientReceiptPageProps {
  gemId: number
}

export default function ClientReceiptPage({ gemId }: ClientReceiptPageProps) {
  const gem = gems.find((g) => g.id === gemId) || gems[0]
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 12000)

    return () => clearTimeout(timer)
  }, [])

  if (showAnimation) {
    return (
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-emerald-900 to-black">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-white my-8">Loan Receipt</h1>
        </div>
        <div className="fixed inset-0 bg-black">
          <video
            src="/card_animation_web.mp4"
            autoPlay
            muted
            className="w-full h-full object-cover"
            onEnded={() => setShowAnimation(false)}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-br from-emerald-900 to-black">
      <h1 className="text-3xl font-bold text-center text-white my-8">Loan Receipt</h1>
      <div className="w-full max-w-[1400px] flex gap-6">
        <div className="flex-1">
          <LoanReceipt gemId={gemId} showAnimation={false} />
        </div>
        <div className="w-[400px]">
          <ChatBot 
            gemId={gem.id}
            gemName={gem.name}
            gemType={gem.type}
            gemCut={gem.cut}
            gemValue={gem.value}
          />
        </div>
      </div>
    </main>
  )
} 