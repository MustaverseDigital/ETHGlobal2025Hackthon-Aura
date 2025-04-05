import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="w-full header-bg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/Aura_Logo.png"
            alt="Aura Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <nav className="flex items-center gap-6">
          <ConnectButton />
        </nav>
      </div>
    </header>
  )
} 