"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 寶石數據
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

export default function GemInventory() {
  const router = useRouter()
  const [selectedGem, setSelectedGem] = useState<(typeof gems)[0] | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isPledging, setIsPledging] = useState(false)

  const handlePledge = () => {
    if (!selectedGem) return

    setIsPledging(true)
    // 模擬抵押過程
    setTimeout(() => {
      setIsPledging(false)
      setIsConfirmOpen(false)
      router.push(`/receipt/${selectedGem.id}`)
    }, 2000)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white/10 backdrop-blur-md border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Current Collateral Rates</CardTitle>
            <CardDescription className="text-emerald-300">Maximum loan-to-value ratio: 70%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gems.map((gem) => (
                <div key={gem.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${gem.color} mr-2`}></div>
                    <span className="text-white">{gem.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-emerald-300 font-medium">{(gem.rate * 100).toFixed(2)}% APR</span>
                    <span className="text-gray-400 text-xs ml-2">LTV 70%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gems.map((gem) => (
          <Card
            key={gem.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedGem?.id === gem.id ? "ring-2 ring-emerald-400 bg-white/20" : "bg-white/10 hover:bg-white/15"
            } backdrop-blur-md border-emerald-500/30`}
            onClick={() => setSelectedGem(gem)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{gem.name}</CardTitle>
                  <CardDescription className="text-emerald-300">{gem.cut}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-900/50 text-emerald-300 border-emerald-500/50">
                  {(gem.rate * 100).toFixed(2)}% APR
                </Badge>
              </div>
              <CardDescription className="text-emerald-300">
                <div className="flex justify-between items-center">
                  <span>Value: {gem.value} ETH</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-2 h-[200px]">
              <iframe
                src={gem.modelUrl}
                className="w-full h-full border-0 rounded-lg"
                title={`3D model of ${gem.name}`}
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedGem(gem)
                  setIsConfirmOpen(true)
                }}
              >
                Pledge
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-8 border-white/30 text-white hover:bg-white/10"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Return to Login
      </Button>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-gray-900 border-emerald-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Pledge</DialogTitle>
            <DialogDescription className="text-gray-300">
              Review the lending terms before confirming your pledge
            </DialogDescription>
          </DialogHeader>

          {selectedGem && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 py-4">
                <div className="w-32 h-32">
                  <iframe
                    src={selectedGem.modelUrl}
                    className="w-full h-full border-0 rounded-lg"
                    title={`3D model of ${selectedGem.name}`}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedGem.name}</h3>
                  <p className="text-sm text-gray-300">Asset ID: #{selectedGem.id}</p>
                  <p className="text-sm text-emerald-300">Type: {selectedGem.type}</p>
                  <p className="text-sm text-emerald-300">Cut: {selectedGem.cut}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-400">Asset Value</p>
                  <p className="text-lg font-medium text-white">{selectedGem.value} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Interest Rate</p>
                  <p className="text-lg font-medium text-emerald-300">{(selectedGem.rate * 100).toFixed(2)}% APR</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Loan-to-Value</p>
                  <p className="text-lg font-medium text-white">70%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Max Loan Amount</p>
                  <p className="text-lg font-medium text-emerald-300">{(selectedGem.value * 0.7).toFixed(2)} ETH</p>
                </div>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Lending Terms</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Loan Duration: 30 days</li>
                  <li>• Repayment Schedule: Full amount at maturity</li>
                  <li>• Early Repayment: Allowed with no penalties</li>
                  <li>• Liquidation Threshold: 85% of initial value</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isPledging}
            >
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handlePledge} disabled={isPledging}>
              {isPledging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Pledge"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

