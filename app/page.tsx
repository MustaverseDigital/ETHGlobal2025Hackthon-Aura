import QRCodeLogin from "@/components/qr-code-login"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-900 to-black">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-8">GemFi: Tokenized Asset Lending</h1>
        <QRCodeLogin />
      </div>
    </main>
  )
}

