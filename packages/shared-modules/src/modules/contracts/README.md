# Contracts

Unifies the contracts calls by providing common interfaces for web and mobile apps.

### API

**symbols**:

- `contractsService` - symbol that allows to call our well-known contracts methods inside shared
  modules.

**utils**:

- `numericValuesToString` - maps object number values to strings
- `calculateSnapshotDate` - generates posix timestamp from day of epoch used as snapshotId in
  contracts.

### Tech notes

Given that `contractsService` symbol is used in shared modules make sure an `IContractsService`
interface is properly implemented on web and mobile. When contracts generated are not in sync with
the interface provide a proper adapter.
