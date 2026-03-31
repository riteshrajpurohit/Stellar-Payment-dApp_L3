import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

// Use a getter or lazily evaluate to prevent Next.js from throwing window is not defined on server side.
let _kit: StellarWalletsKit | null = null;

export const getKit = () => {
  if (typeof window === "undefined") {
    // Return a dummy object or null during SSR
    return null;
  }
  
  if (!_kit) {
    _kit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });
  }
  return _kit;
};

// Exporting a lazy proxy so we don't have to rewrite imports everywhere
export const kit = new Proxy({} as StellarWalletsKit, {
  get(target, prop) {
    const activeKit = getKit();
    if (!activeKit) return undefined;
    return Reflect.get(activeKit, prop);
  }
});
