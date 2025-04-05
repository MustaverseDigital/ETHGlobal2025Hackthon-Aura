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

// 模擬寶石數據
const gems = [
  {
    id: 1,
    name: "Ruby",
    value: 2.5,
    rate: 0.08,
    image: "/placeholder.svg?height=100&width=100",
    color: "bg-red-500",
  },
  {
    id: 2,
    name: "Sapphire",
    value: 3.2,
    rate: 0.075,
    image: "/placeholder.svg?height=100&width=100",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Emerald",
    value: 1.8,
    rate: 0.09,
    image: "/placeholder.svg?height=100&width=100",
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "Diamond",
    value: 5.0,
    rate: 0.065,
    image: "/placeholder.svg?height=100&width=100",
    color: "bg-purple-300",
  },
  {
    id: 5,
    name: "Yellow Sapphire",
    value: 2.1,
    rate: 0.085,
    image: "/placeholder.svg?height=100&width=100",
    color: "bg-yellow-400",
  },
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
            <CardTitle className="text-white text-lg">Current Lending Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gems.map((gem) => (
                <div key={gem.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${gem.color} mr-2`}></div>
                    <span className="text-white">{gem.name}</span>
                  </div>
                  <span className="text-emerald-300">{(gem.rate * 100).toFixed(2)}%</span>
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
                <CardTitle className="text-white">{gem.name}</CardTitle>
                <Badge variant="outline" className="bg-emerald-900/50 text-emerald-300 border-emerald-500/50">
                  {(gem.rate * 100).toFixed(2)}% APR
                </Badge>
              </div>
              <CardDescription className="text-emerald-300">Valuation: {gem.value} ETH</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">
              <div className={`w-24 h-24 rounded-lg ${gem.color} flex items-center justify-center`}>
                <span className="text-4xl">💎</span>
              </div>
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
              You are about to pledge the following gem to get a loan
            </DialogDescription>
          </DialogHeader>

          {selectedGem && (
            <div className="flex items-center space-x-4 py-4">
              <div className={`w-16 h-16 rounded-lg ${selectedGem.color} flex items-center justify-center`}>
                <span className="text-2xl">💎</span>
              </div>
              <div>
                <h3 className="font-medium">{selectedGem.name}</h3>
                <p className="text-sm text-gray-300">Valuation: {selectedGem.value} ETH</p>
                <p className="text-sm text-emerald-300">Interest Rate: {(selectedGem.rate * 100).toFixed(2)}% APR</p>
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

