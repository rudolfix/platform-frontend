import { assertNever, invariant } from "@neufund/shared-utils";
import React from "react";
import { compose } from "recompose";

import { AccountBackupScreenLayout } from "components/screens/AccountBackupScreen/AccountBackupScreenLayout";
import { EWalletUIType, TWalletUI } from "components/screens/AccountBackupScreen/types";

import { withProtectSensitive } from "hocs/withProtectSensitive";

import { useSymbol } from "hooks/useSymbol";

import { EWalletType } from "modules/eth/lib/types";
import { walletEthModuleApi } from "modules/eth/module";

import { useNavigationTyped } from "router/routeUtils";

enum EUIStatus {
  LOADING = "loading",
  ERROR = "error",
  READY = "ready",
}

type TReadyStatus = { status: EUIStatus.READY; data: TWalletUI; allowedTypes: EWalletUIType[] };

type TStateProps = { status: EUIStatus.LOADING | EUIStatus.ERROR } | TReadyStatus;

type TActions =
  | {
      type: "SET_ERROR";
    }
  | {
      type: "SET_DATA";
      payload: { data: TWalletUI; allowedTypes: EWalletUIType[] };
    };

const initialState: TStateProps = {
  status: EUIStatus.LOADING,
};

const accountBackupUIReducer = (_: TStateProps, action: TActions): TStateProps => {
  switch (action.type) {
    case "SET_DATA":
      return {
        status: EUIStatus.READY,
        data: action.payload.data,
        allowedTypes: action.payload.allowedTypes,
      };
    case "SET_ERROR":
      return {
        status: EUIStatus.ERROR,
      };
    default:
      assertNever(action);
  }
};

/**
 * @note
 * Given that private-key/mnemonic are sensitive data it's important to make sure they are short-lived and collected from memory as soon as they are not needed.
 * Therefore this component doesn't use a normal flow of data from store to ui but rather keeps all data in internal state and call libs directly.
 *
 * !Important: Always make sure that `AccountBackupScreenLogic` is wrapped into `withProtectSensitive` HOC to force unmounting and therefore cleaning up sensitive data from memory.
 */
const AccountBackupScreenLogic = () => {
  const navigation = useNavigationTyped();

  const ethManager = useSymbol(walletEthModuleApi.symbols.ethManager);

  const [state, dispatch] = React.useReducer(accountBackupUIReducer, initialState);

  const getType = React.useCallback(
    async (type: EWalletUIType): Promise<TWalletUI> => {
      switch (type) {
        case EWalletUIType.MNEMONIC: {
          const mnemonic = await ethManager.unsafeExportWalletMnemonic();

          return {
            type: EWalletUIType.MNEMONIC,
            value: mnemonic.split(/\s/),
          };
        }

        case EWalletUIType.PRIVATE_KEY: {
          const privateKey = await ethManager.unsafeExportWalletPrivateKey();

          return {
            type: EWalletUIType.PRIVATE_KEY,
            value: privateKey,
          };
        }
        default:
          assertNever(type);
      }
    },
    [ethManager],
  );

  React.useEffect(() => {
    const load = async () => {
      try {
        const walletMetadata = await ethManager.getExistingWalletMetadata();

        invariant(walletMetadata, "Wallet metadata's should be defined at this point");

        switch (walletMetadata.type) {
          case EWalletType.HD_WALLET:
            {
              const data = await getType(EWalletUIType.MNEMONIC);

              dispatch({
                type: "SET_DATA",
                payload: {
                  data,
                  allowedTypes: [EWalletUIType.PRIVATE_KEY, EWalletUIType.MNEMONIC],
                },
              });
            }
            break;

          case EWalletType.PRIVATE_KEY_WALLET:
            {
              const data = await getType(EWalletUIType.PRIVATE_KEY);

              dispatch({
                type: "SET_DATA",
                payload: {
                  data,
                  allowedTypes: [EWalletUIType.PRIVATE_KEY],
                },
              });
            }
            break;

          default:
            assertNever(walletMetadata.type);
        }
      } catch (e) {
        // in case storage access got's cancelled navigate back
        if (e instanceof walletEthModuleApi.errors.SecureStorageAccessCancelled) {
          if (navigation.canGoBack()) {
            navigation.goBack();

            return;
          }
        }

        dispatch({
          type: "SET_ERROR",
        });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    load();
  }, [ethManager, getType, navigation]);

  const changeType = async (type: EWalletUIType) => {
    invariant(state.status === EUIStatus.READY, `Invalid UI status ${state.status}`);
    invariant(state.allowedTypes.includes(type), `Invalid type ${type}`);

    const data = await getType(type);

    dispatch({
      type: "SET_DATA",
      payload: {
        data,
        allowedTypes: state.allowedTypes,
      },
    });
  };

  switch (state.status) {
    case EUIStatus.LOADING:
      return null;
    case EUIStatus.ERROR:
      // TODO: Show error layout when wallet pr is merged
      return null;
    case EUIStatus.READY:
      return (
        <AccountBackupScreenLayout
          data={state.data}
          onTypeChange={changeType}
          allowedTypes={state.allowedTypes}
        />
      );
    default:
      assertNever(state);
  }
};

const AccountBackupScreen = compose(
  withProtectSensitive,
  // TODO: Compose error layout when wallet pr is merged
)(AccountBackupScreenLogic);

export { AccountBackupScreen };
