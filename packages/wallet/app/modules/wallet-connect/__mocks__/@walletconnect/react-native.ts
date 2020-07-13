import { createMock } from "utils/testUtils.specUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WalletConnect = jest.requireActual<new (...args: any[]) => any>(
  "@walletconnect/react-native",
);

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const WC = jest.fn(() => createMock(WalletConnect, {}));

// eslint-disable-next-line import/no-default-export
export default WC;
