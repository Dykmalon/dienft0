import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import {
  UserRejectedRequestError as WUserRejectedRequestError,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";

import { toast } from "react-hot-toast";
import { metaMask, walletConnect } from "../connector";
import { CACHE_PROVIDER } from "../constants";

const resetWalletConnector = (connector) => {
  if (connector && connector instanceof WalletConnectConnector) {
    console.log("resetting");
    connector.walletConnectProvider = undefined;
  }
};
const handleError = async (error) => {
  resetWalletConnector(walletConnect);
  if (error instanceof NoEthereumProviderError) {
    toast.error(
      "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile."
    );
  } else if (error instanceof UnsupportedChainIdError) {
    toast.error("You're connected to an unsupported network.");
  } else if (
    error instanceof UserRejectedRequestError ||
    error instanceof WUserRejectedRequestError
  ) {
    toast.error(
      "Please authorize this website to access your Ethereum account."
    );
  } else if (error.message.includes("Already processing eth_requestAccount")) {
    toast.error(
      "Already processing eth_requestAccounts. Please check your wallet."
    );
  } else {

    toast.error(
      "An unknown error occurred. Check the console for more details."
    );
  }
};

export const useWallet = () => {
  const { activate, connector, ...props } = useWeb3React();
  const connectWallet = async (wallet1) => {

    try {
      if (wallet1) {
        const { ethereum } = window;
        if (!ethereum) {
          return toast.error(
            "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile."
          );
        }
        await activate(metaMask, (error) => handleError(error));
        localStorage.setItem(CACHE_PROVIDER, "true");
      } else {
        await activate(walletConnect, (error) => handleError(error));
      }
    } catch (err) {
      console.log("Connect wallet", err);
    }
  };

  const disconnectWallet = async () => {
    props.deactivate();
    localStorage.removeItem(CACHE_PROVIDER);
  };

  return {
    ...props,
    connector,
    connectWallet,
    disconnectWallet,
  };
};
