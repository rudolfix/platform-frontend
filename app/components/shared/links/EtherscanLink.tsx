import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { ExternalLink } from "./ExternalLink";

interface IEtherscanTxLink {
  txHash: string;
}

const EtherscanTxLink: React.FunctionComponent<IEtherscanTxLink & CommonHtmlProps> = ({
  txHash,
  children,
  ...props
}) => (
  <ExternalLink href={`https://etherscan.io/tx/${txHash}`} {...props}>
    {children || `etherscan.io`}
  </ExternalLink>
);

interface IEtherscanAddressLink {
  address: string;
}

const EtherscanAddressLink: React.FunctionComponent<IEtherscanAddressLink & CommonHtmlProps> = ({
  address,
  children,
  ...props
}) => (
  <ExternalLink href={`https://etherscan.io/address/${address}`} {...props}>
    {children || `etherscan.io`}
  </ExternalLink>
);

export { EtherscanTxLink, EtherscanAddressLink };
