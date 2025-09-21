import { createConfig, http } from "wagmi";
import { baseSepolia, inkSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [inkSepolia, baseSepolia],
  transports: {
    [inkSepolia.id]: http(),
    [baseSepolia.id]: http()
  }
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}