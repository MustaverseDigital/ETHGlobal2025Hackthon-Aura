import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          GemFi
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/inventory" className="hover:text-primary">
            Portfolio
          </Link>
          <Link href="/loans" className="hover:text-primary">
            Lending
          </Link>
          <ConnectButton />
        </nav>
      </div>
    </header>
  )
} 