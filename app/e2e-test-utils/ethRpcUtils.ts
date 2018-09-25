export const requestFromWeb3Node = (
  nodeAddress: string,
  methodName: string,
  params: string[] | object[],
) =>
  cy.request({
    url: nodeAddress,
    method: "POST",
    body: {
      jsonrpc: "2.0",
      method: methodName,
      params,
      id: 1,
    },
  });

export const getTransactionByHashRpc = (nodeAddress: string, txHash: string) =>
  requestFromWeb3Node(nodeAddress, "eth_getTransactionByHash", [txHash]);

export const getTransactionReceiptRpc = (nodeAddress: string, txHash: string) =>
  requestFromWeb3Node(nodeAddress, "eth_getTransactionReceipt", [txHash]);

export const getBalanceRpc = (nodeAddress: string, address: string) =>
  requestFromWeb3Node(nodeAddress, "eth_getBalance", [address, "latest"]);

export const sendTransactionRpc = (
  nodeAddress: string,
  from: string,
  to: string,
  gas: string | undefined = "0x21000",
  gasPrice: string | undefined = "0x00",
  value: string | undefined = "0x00",
  data: string | undefined = "0x00",
) =>
  requestFromWeb3Node(nodeAddress, "eth_sendTransaction  ", [
    {
      from,
      to,
      gas,
      gasPrice,
      value,
      data,
    },
  ]);
