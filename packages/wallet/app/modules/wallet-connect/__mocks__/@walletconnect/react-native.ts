import { createMock } from "utils/testUtils.specUtils";

const WalletConnect = jest.requireActual<new (...args: unknown[]) => unknown>(
  "@walletconnect/react-native",
);

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const WC = jest.fn(() => createMock(WalletConnect, {}));

// eslint-disable-next-line import/no-default-export
export default WC;
