"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function QRCodeLogin() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)

  // Mock QR code scanning and login process
  const handleScan = () => {
    setIsScanning(true)
    // Mock network request delay
    setTimeout(() => {
      setIsScanning(false)
      router.push("/inventory")
    }, 2000)
  }

  return (
    <Card className="w-full bg-white/10 backdrop-blur-md border-emerald-500/30">
      <CardHeader>
        <CardTitle className="text-center text-white">Scan QR Code to Login</CardTitle>
        <CardDescription className="text-center text-emerald-300">
          Use your wallet app to scan the QR code below
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-64 h-64 bg-white p-4 rounded-lg mb-4 flex items-center justify-center">
          {/* Place QR code image here */}
          <div className="w-full h-full border-2 border-dashed border-gray-400 flex items-center justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="40" height="40" fill="black" />
              <rect x="70" y="20" width="40" height="40" fill="black" />
              <rect x="120" y="20" width="40" height="40" fill="black" />
              <rect x="20" y="70" width="40" height="40" fill="black" />
              <rect x="120" y="70" width="40" height="40" fill="black" />
              <rect x="20" y="120" width="40" height="40" fill="black" />
              <rect x="70" y="120" width="40" height="40" fill="black" />
              <rect x="120" y="120" width="40" height="40" fill="black" />
              <rect x="30" y="30" width="20" height="20" fill="white" />
              <rect x="80" y="30" width="20" height="20" fill="white" />
              <rect x="130" y="30" width="20" height="20" fill="white" />
              <rect x="30" y="80" width="20" height="20" fill="white" />
              <rect x="80" y="80" width="20" height="20" fill="black" />
              <rect x="130" y="80" width="20" height="20" fill="white" />
              <rect x="30" y="130" width="20" height="20" fill="white" />
              <rect x="80" y="130" width="20" height="20" fill="white" />
              <rect x="130" y="130" width="20" height="20" fill="white" />
            </svg>
          </div>
        </div>
        <p className="text-sm text-white/80 text-center mb-4">
          Please ensure your wallet app is updated to the latest version and DeFi features are enabled
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleScan} disabled={isScanning}>
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Simulate Scan Login"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

