/* import * as Web3 from "web3";

class Web3TestRPC {
  // @todo add correct web3 type
  private web3: Web3;
  constructor(rpcUrl: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  public getWeb3Instance(): Web3 {
    return this.web3;
  }
}
export default new Web3TestRPC("https://localhost:9090/node"); */

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
