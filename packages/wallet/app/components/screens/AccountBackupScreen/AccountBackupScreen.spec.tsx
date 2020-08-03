import {
  toEthereumChecksumAddress,
  toEthereumHDMnemonic,
  UnknownObject,
} from "@neufund/shared-utils";
import { render, wait, cleanup, act } from "@testing-library/react-native";
import * as React from "react";
import { View } from "react-native";
import { mocked } from "ts-jest/utils";

import { useSymbol } from "hooks/useSymbol";

import { EthManager } from "modules/eth/lib/EthManager";
import { EWalletType } from "modules/eth/lib/types";
import { walletEthModuleApi } from "modules/eth/module";

import { useNavigationTyped } from "router/routeUtils";

import { createMock } from "utils/testUtils.specUtils";

import { AccountBackupScreen } from "./AccountBackupScreen";

const MockView = View;

jest.mock("hocs/withProtectSensitive", () => ({
  withProtectSensitive: (Component: React.ComponentType) => (props: UnknownObject) => (
    <MockView testID="protect-sensitive">
      <Component {...props} />
    </MockView>
  ),
}));
jest.mock("./AccountBackupScreenLayout", () => ({
  AccountBackupScreenLayout: (props: UnknownObject) => <MockView testID="layout" {...props} />,
}));

jest.mock("router/routeUtils");
jest.mock("hooks/useSymbol");

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn();
const mockEthManager = createMock(EthManager, {});

describe("AccountBackupScreen", () => {
  beforeEach(() => {
    mocked(useSymbol).mockImplementation((symbol: symbol) => {
      if (symbol === walletEthModuleApi.symbols.ethManager) {
        return mockEthManager;
      }

      throw new Error(`Invalid symbol ${symbol.toString()}`);
    });

    const mockNavigationTyped = { goBack: mockGoBack, canGoBack: mockCanGoBack };
    mocked<() => Pick<ReturnType<typeof useNavigationTyped>, "goBack" | "canGoBack">>(
      useNavigationTyped,
    ).mockImplementation(() => mockNavigationTyped);
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should go back when permissions check was cancelled", async () => {
    mockEthManager.MOCK.getExistingWalletMetadata.mockResolvedValue({
      type: EWalletType.HD_WALLET,
      address: toEthereumChecksumAddress("0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988"),
      name: undefined,
    });
    mockEthManager.MOCK.unsafeExportWalletMnemonic.mockRejectedValue(
      new walletEthModuleApi.errors.SecureStorageAccessCancelled(),
    );
    mockCanGoBack.mockReturnValue(true);

    render(<AccountBackupScreen />);

    await wait(() => expect(mockGoBack).toHaveBeenCalled());
  });

  it("should render layout wrapped into `withProtectSensitive`", async () => {
    mockEthManager.MOCK.getExistingWalletMetadata.mockResolvedValue({
      type: EWalletType.HD_WALLET,
      address: toEthereumChecksumAddress("0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988"),
      name: undefined,
    });
    mockEthManager.MOCK.unsafeExportWalletMnemonic.mockResolvedValue(
      toEthereumHDMnemonic(
        "bread sick proud swift orchard wish model mammal brass ready dinner pave runway can twelve best bundle filter stuff sister paddle kangaroo keep supply",
      ),
    );

    const { getByTestId, queryByTestId } = render(<AccountBackupScreen />);

    await act(async () => {
      await wait(() => getByTestId("layout"));
    });

    expect(queryByTestId("protect-sensitive")).not.toBeNull();
  });
});
