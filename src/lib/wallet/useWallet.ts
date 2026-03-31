import { create } from "zustand";
import { kit } from "@/lib/wallet/wallet-kit";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toast";

interface WalletState {
  address: string | null;
  selectedWallet: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  supportedWallets: any[];
  setAddress: (address: string) => void;
  connect: (walletId?: string) => Promise<void>;
  disconnect: () => void;
  init: () => Promise<void>;
  signTransaction: (xdr: string) => Promise<string>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  selectedWallet: null,
  isConnected: false,
  isConnecting: false,
  supportedWallets: [],

  setAddress: (address) => set({ address, isConnected: true }),

  init: async () => {
    try {
      const supportedWallets = await kit.getSupportedWallets();
      set({ supportedWallets });

      const savedWallet = localStorage.getItem("selectedWallet");
      if (savedWallet) {
        kit.setWallet(savedWallet);
        const { address } = await kit.getAddress();
        set({ address, selectedWallet: savedWallet, isConnected: !!address });
      }
    } catch (e) {
      console.error("Wallet init error:", e);
    }
  },

  connect: async (walletId) => {
    set({ isConnecting: true });
    try {
      if (walletId) kit.setWallet(walletId);

      const { address } = await kit.getAddress();

      const activeWallet = walletId;

      if (activeWallet) {
        localStorage.setItem("selectedWallet", activeWallet);
      }

      set({ address, selectedWallet: activeWallet, isConnected: true });
      notifySuccess(
        "Wallet connected",
        `Successfully connected to ${activeWallet}`,
      );
    } catch (error: any) {
      notifyError(
        "Connection failed",
        error.message || "Failed to connect wallet",
      );
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: () => {
    localStorage.removeItem("selectedWallet");
    set({ address: null, selectedWallet: null, isConnected: false });
    notifyInfo("Disconnected", "Wallet has been disconnected");
  },

  signTransaction: async (xdr: string) => {
    const { address } = get();
    if (!address) throw new Error("No wallet connected");
    const result = await kit.signTransaction(xdr, {
      networkPassphrase: "Test SDF Network ; September 2015",
    });
    return result.signedTxXdr;
  },
}));
