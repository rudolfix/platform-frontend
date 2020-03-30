# wallet-connect module

Manages a [WalletConnect](https://walletconnect.org/) session.

### API

Wallet connect session can be started by dispatching a `connectToPeer` action. Connected peer can be
retrieved with `selectWalletConnectPeer` selector.

### Future

It's just a basic implementation of a wallet connect integration. As a next milestone we need to
save the session in the app storage. After web wallet connect integration is ready we will need to
implement a proper UI and replace `eth_sendTransaction` with a custom `eth_sendTypedTransaction`.
