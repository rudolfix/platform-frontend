/*
* this is a noop implementation of web3 block tracker.
* By default provider engine uses its internal block tracker that downloads each block.
* Since we already have block tracking in the Web3Manager, this is redundant.
* To avoid it, NullBlockTracker should be supplied to provider engine whenever we use it
* */

export class NullBlockTracker {
  on = ()=> {};
  removeAllListeners = () => {};
}
