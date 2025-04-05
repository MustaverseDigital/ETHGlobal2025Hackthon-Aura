'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'
import { polygonAmoy  } from 'viem/chains'
import { useState } from 'react'
import { injected } from 'wagmi/connectors'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  const [wagmiConfig] = useState(() => {
    return createConfig({
      chains: [polygonAmoy],
      transports: {
        [polygonAmoy.id]: http(),
      },
      connectors: [
        injected(),
      ],
    })
  })

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 