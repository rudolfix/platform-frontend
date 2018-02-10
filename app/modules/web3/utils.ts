import * as Eip55 from "eip55";

import { EthereumAddress, EthereumAddressWithChecksum } from "../../types";

export function makeEthereumAddressChecksummed(
  ethereumAddress: EthereumAddress,
): EthereumAddressWithChecksum {
  return Eip55.encode(ethereumAddress) as EthereumAddressWithChecksum;
}
