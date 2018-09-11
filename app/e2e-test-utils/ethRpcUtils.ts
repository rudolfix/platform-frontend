export const requestFromWeb3Node = (nodeAddress: string, methodName: string, params: string[]) =>
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

export const getTransactionReceiptRpc = (nodeAddress: string, txHash: string) =>
  requestFromWeb3Node(nodeAddress, "eth_getTransactionByHash", [txHash]);

export const getBalanceRpc = (nodeAddress: string, address: string) =>
  requestFromWeb3Node(nodeAddress, "eth_getBalance", [address, "latest"]);
