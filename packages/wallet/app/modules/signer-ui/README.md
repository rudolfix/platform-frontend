# signer-ui module

Module provides a way to sign cryptographically with wallet private key messages (for e.g. change
email, send transaction).

### API

Signing flow can we started by dispatching `sign` action. When the action gets approved in UI module
dispatches `signed` action. If rejected `denied` action get's dispatched.

### Future

Let's see how this module will evolve in the future. Given that we need to implement transaction
watchers a decision needs to be made whether couple `signer-ui` with tx watcher or do a watcher as a
separate module.
