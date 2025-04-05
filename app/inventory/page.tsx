import GemInventory from "@/components/gem-inventory"

export default function InventoryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-br from-emerald-900 to-black">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-white my-8">My Gem Inventory</h1>
        <GemInventory />
      </div>
    </main>
  )
}

