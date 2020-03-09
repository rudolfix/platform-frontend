# ETH module

### Purpose

Eth module abstracts and controls all operations related to the communication with eth node and
holds securely private keys.

### API

Module exposes at the moment only `EthManager` that should be treated like a bridge to ETH world. It
can be used to get all required information from ETH node and to send or sign transactions.

### Future

Soon we gonna add sagas to allow control over plugging new wallets from UI.

Some part of the module gonna be also moved to the native code for a more fine-grained control.

### Tech notes

It's a very crucial part of our system so please pay attention to the unit tests coverage when
adding new functionality.

Please pay extreme attention to security of private key and mnemonics. Avoid exposing raw private
key or mnemonics to RAM memory whenever possible.
