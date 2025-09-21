import { GelatoSmartWalletProvider } from "@gelatonetwork/smartwallet-react-wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useState } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "../wagmi";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  const gelatoApiKey = process.env.NEXT_PUBLIC_GELATO_API_KEY;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GelatoSmartWalletProvider
          params={{
            apiKey: gelatoApiKey,
            scw: {
              eip7702: false,
              type: "kernel"
            }
          }}
        >
          <Component {...pageProps} />
        </GelatoSmartWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
