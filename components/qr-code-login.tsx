"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';


export default function QRCodeLogin() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  //const [] // TODO add usestate for next page

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(uuidv4());
  }, []);

  if (!userId) return null;

  const selfApp = new SelfAppBuilder({
    appName: "My Application",
    scope: "my-application-scope",
    endpoint: "https://a69f-111-235-226-130.ngrok-free.app/api/verify", // need to fix based on ngrok https port
    logoBase64: "https://brown-implicit-bass-794.mypinata.cloud/ipfs/bafkreide66mo5jobwmf523ijontxw2bo3446sf5xexwrxsmust4r3bd6ei",
    userId,
    disclosures: {
      minimumAge: 18,
      nationality: true,
    },
  }).build();
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
        <div className="w-[350px] h-[350px] bg-white p-4 rounded-lg mb-4 flex items-center justify-center">
          {/* Place QR code image here */}
          <div className="flex flex-col items-center gap-6">
            <SelfQRcodeWrapper
              selfApp={selfApp}
              type='deeplink'
              darkMode={true}
              onSuccess={() => {
                setTimeout(() => {
                  router.push("/inventory");
                }, 1500);
              }}
              size={300}
            />
          </div>
        </div>
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

