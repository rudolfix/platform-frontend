export enum ETransactionStatus {
  SUCCESS = "0x1",
  REVERTED = "0X0",
}

const requestFromWeb3Node = (
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

export const getNonceRpc = (nodeAddress: string, address: string) =>
  requestFromWeb3Node(nodeAddress, "eth_getTransactionCount", [address, "latest"]);

export const getChainIdRpc = (nodeAddress: string) =>
  requestFromWeb3Node(nodeAddress, "net_version", []);

export const sendRawTransactionRpc = (nodeAddress: string, data: string) =>
  requestFromWeb3Node(nodeAddress, "eth_sendRawTransaction", [data]);

export const getTransactionReceipt = (nodeAddress: string, hash: string) =>
  requestFromWeb3Node(nodeAddress, "eth_getTransactionReceipt", [hash]);
