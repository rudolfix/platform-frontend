import * as React from "react";

import { CommonHtmlProps } from "../../types";

interface IEtherscanTxLink {
  txHash: string;
}

const EtherscanTxLink: React.FunctionComponent<IEtherscanTxLink & CommonHtmlProps> = ({
  txHash,
  children,
  ...props
}) => (
  <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" {...props}>
    {children || `etherscan.io`}
  </a>
);

interface IEtherscanAddressLink {
  address: string;
}

const EtherscanAddressLink: React.FunctionComponent<IEtherscanAddressLink & CommonHtmlProps> = ({
  address,
  children,
  ...props
}) => (
  <a href={`https://etherscan.io/address/${address}`} target="_blank" {...props}>
    {children || `etherscan.io`}
  </a>
);

export { EtherscanTxLink, EtherscanAddressLink };
