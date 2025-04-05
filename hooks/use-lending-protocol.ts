import { useWriteContract } from 'wagmi'
import { LENDING_PROTOCOL_ADDRESS } from '@/config/contracts'
import { type Abi, Address } from 'viem'

const LendingProtocolABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "stablecoin",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "loanAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "interestRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "inquiryDuration",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "assetType",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "assetAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "internalType": "tuple[]",
        "name": "collateralAssets",
        "type": "tuple[]"
      }
    ],
    "name": "requestLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const satisfies Abi

export function useLendingProtocol() {
  const { writeContract, isPending: isWritePending } = useWriteContract()

  const requestLoan = async ({
    stablecoin,
    loanAmount,
    interestRate,
    duration,
    inquiryDuration,
    collateralAssets,
    onSuccess
  }: {
    stablecoin: Address
    loanAmount: bigint
    interestRate: bigint
    duration: bigint
    inquiryDuration: bigint
    collateralAssets: {
      assetType: number
      assetAddress: Address
      tokenId: bigint
      amount: bigint
    }[]
    onSuccess?: (hash: `0x${string}`) => void
  }) => {
    try {
      const hash = await writeContract({
        address: LENDING_PROTOCOL_ADDRESS as Address,
        abi: LendingProtocolABI,
        functionName: 'requestLoan',
        args: [
          stablecoin,
          loanAmount,
          interestRate,
          duration,
          inquiryDuration,
          collateralAssets
        ],
      })

      if (onSuccess && hash) {
        onSuccess(hash)
      }

      return hash
    } catch (error) {
      console.error('Error requesting loan:', error)
      throw error
    }
  }

  return {
    requestLoan,
    isWritePending
  }
} 