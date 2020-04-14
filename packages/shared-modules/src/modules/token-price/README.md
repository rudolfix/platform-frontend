# Token price

Keeps token price rate up to date by pulling `RateOracle` smart contact.

### API

**config**

- `refreshOnAction` - custom action type that triggers refresh of token price rates. It makes sense
  to refresh token prices on each new ethereum block.

**actions**:

- `watchTokenPriceStart` - starts watching for latest token price rates

- `watchTokenPriceStop` - stops watching for token prices

### Tech notes
