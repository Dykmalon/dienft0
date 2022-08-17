import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const metaMask = new InjectedConnector({
  supportedChainIds: [1],
});

export { metaMask };
