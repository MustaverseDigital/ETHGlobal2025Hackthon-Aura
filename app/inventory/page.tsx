import GemInventory from "@/components/gem-inventory"

export default function InventoryPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-900 to-black">
      <div className="flex-1">
        <GemInventory />
      </div>
    </main>
  )
}

