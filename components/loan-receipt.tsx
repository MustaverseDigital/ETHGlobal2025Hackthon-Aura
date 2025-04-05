"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Copy, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

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

export default function LoanReceipt({ gemId }: { gemId: number }) {
  const router = useRouter()
  const [showAnimation, setShowAnimation] = useState(true)
  const [copied, setCopied] = useState(false)

  // Find corresponding gem
  const gem = gems.find((g) => g.id === gemId) || gems[0]

  // Generate loan receipt information
  const loanAmount = (gem.value * 0.7).toFixed(2) // Assume 70% of the valuation can be borrowed
  const interestRate = (gem.rate * 100).toFixed(2)
  const loanDate = new Date().toLocaleDateString()
  const liquidationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() // 30 days later
  const receiptId = `LOAN-${Date.now().toString().slice(-6)}-${gemId}`

  // Mock copy functionality
  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Show receipt after animation ends
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (showAnimation) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.2, 1],
            opacity: [0, 1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 2 }}
          className="w-32 h-32"
        >
          <iframe
            src={gem.modelUrl}
            className="w-full h-full border-0 rounded-lg"
            title={`3D model of ${gem.name}`}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-white text-xl font-medium text-center"
        >
          Pledge successful! Generating receipt...
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-md border-emerald-500/30 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white text-xl">Loan Receipt</CardTitle>
              <CardDescription className="text-emerald-300">Receipt ID: {receiptId}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-900/50 text-emerald-300 border-emerald-500/50">
              Pledged
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-32 h-32">
              <iframe
                src={gem.modelUrl}
                className="w-full h-full border-0 rounded-lg"
                title={`3D model of ${gem.name}`}
              />
            </div>
            <div>
              <h3 className="font-medium text-white">{gem.name}</h3>
              <p className="text-sm text-gray-300">Type: {gem.type}</p>
              <p className="text-sm text-gray-300">Cut: {gem.cut}</p>
              <p className="text-sm text-gray-300">Valuation: {gem.value} ETH</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Loan Amount</p>
              <p className="text-lg font-medium text-white">{loanAmount} ETH</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Annual Interest Rate</p>
              <p className="text-lg font-medium text-emerald-300">{interestRate}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Loan Date</p>
              <p className="text-sm text-white">{loanDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Liquidation Date</p>
              <p className="text-sm text-white">{liquidationDate}</p>
            </div>
          </div>

          <div className="rounded-md bg-gray-800/50 p-4 border border-gray-700">
            <h4 className="text-sm font-medium text-white mb-2">Lending Terms & Conditions</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Collateral may be liquidated if loan is not repaid by the maturity date</li>
              <li>• No prepayment penalties for early loan settlement</li>
              <li>• Additional collateral can be deposited during the loan term</li>
              <li>• Market volatility may trigger liquidation protocols</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
              onClick={handleCopy}
            >
              {copied ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied" : "Copy Receipt"}
            </Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full text-white hover:bg-white/10"
            onClick={() => router.push("/inventory")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Inventory
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}

