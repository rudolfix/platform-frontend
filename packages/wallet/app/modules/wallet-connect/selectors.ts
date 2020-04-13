import { createSelector } from "reselect";

const selectWalletConnect = (state: any) => state.walletConnect;

const selectWalletConnectPeer = createSelector(
  selectWalletConnect,
  walletConnect => walletConnect.connectedPeer,
);

export { selectWalletConnectPeer };
