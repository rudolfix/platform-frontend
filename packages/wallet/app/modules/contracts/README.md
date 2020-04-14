# Contracts

Manages the creation and communication with all Neufund smart contracts.

### API

**symbols**:

- `contractsService` - symbol that allows to call our well-known contracts methods.

**sagas**:

- `initializeContracts` - the saga should be called during app init phase to have all contracts
  initialized before other sagas are trying to use anything `contractsService`.

### Tech notes

Given that `ContractsService` is shared between web and mobile make sure an `IContractsService`
interface is properly implemented. When contracts generated are not in sync with the interface
provide a proper adapter.
