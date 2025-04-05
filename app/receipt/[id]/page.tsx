import LoanReceipt from "@/components/loan-receipt"

interface ReceiptPageProps {
  params: {
    id: string
  }
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const gemId = Number.parseInt(params.id)

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-br from-emerald-900 to-black">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-white my-8">Loan Receipt</h1>
        <LoanReceipt gemId={gemId} />
      </div>
    </main>
  )
}

