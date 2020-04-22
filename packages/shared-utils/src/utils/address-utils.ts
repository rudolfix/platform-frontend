/**
 * Ellipsize Ethereum addresses
 * @param address
 */
export const trimAddress = (address: string) => `${address.slice(0, 10)}...${address.slice(-4)}`;
