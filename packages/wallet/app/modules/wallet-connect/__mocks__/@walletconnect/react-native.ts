const WalletConnect = jest.requireActual("@walletconnect/react-native");

import { createMock } from "../../../../utils/testUtils.specUtils";

const WC = jest.fn(() => createMock(WalletConnect, {}));

export default WC;
