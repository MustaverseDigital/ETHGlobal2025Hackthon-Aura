import { Suspense } from "react"
import ClientReceiptPage from "@/components/client-receipt-page"

interface ReceiptPageProps {
  params: {
    id: string
  }
}

export default function ReceiptPage({ params }: ReceiptPageProps) {
  const gemId = Number.parseInt(params.id)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientReceiptPage gemId={gemId} />
    </Suspense>
  )
}

