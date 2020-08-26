import {
  EEtoStateColor,
  EEtoStateUIName,
  etoModuleApi,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps, TTranslatedString } from "../../../types";

import * as styles from "./ETOState.module.scss";

export enum EProjectStatusSize {
  MEDIUM = "medium",
  LARGE = "large",
  SMALL = "small",
  HUGE = "huge",
}

export enum EProjectStatusLayout {
  NORMAL = "normal",
  BLACK = "black",
  INHERIT = "inherit",
}

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

interface ISizeLayoutProps {
  size?: EProjectStatusSize;
  layout?: EProjectStatusLayout;
}

export const generalStateToName: Record<EEtoStateUIName, TTranslatedString> = {
  [EEtoStateUIName.CAMPAIGNING]: <FormattedMessage id="eto.status.onchain.setup" />,
  [EEtoStateUIName.DRAFT]: (
    <FormattedMessage id="shared-component.eto-overview.status-in-preview" />
  ),
  [EEtoStateUIName.PENDING]: <FormattedMessage id="shared-component.eto-overview.status-pending" />,
  [EEtoStateUIName.ON_CHAIN]: (
    <FormattedMessage id="shared-component.eto-overview.status-on-chain" />
  ),
  [EEtoStateUIName.SUSPENDED]: (
    <FormattedMessage id="shared-component.eto-overview.status-suspended" />
  ),
  [EEtoStateUIName.PRESALE]: <FormattedMessage id="eto.status.onchain.whitelist" />,
  [EEtoStateUIName.PUBLIC_SALE]: <FormattedMessage id="eto.status.onchain.public" />,
  [EEtoStateUIName.IN_SIGNING]: <FormattedMessage id="eto.status.onchain.signing" />,
  [EEtoStateUIName.CLAIM]: <FormattedMessage id="eto.status.onchain.claim" />,
  [EEtoStateUIName.PAYOUT]: <FormattedMessage id="eto.status.onchain.payout" />,
  [EEtoStateUIName.REFUND]: <FormattedMessage id="eto.status.onchain.refund" />,
  [EEtoStateUIName.WHITELISTING]: <FormattedMessage id="eto.status.sub-state.whitelisting" />,
};

export const issuerOnChainStateToName: Partial<Record<EEtoStateUIName, TTranslatedString>> = {
  [EEtoStateUIName.WHITELISTING]: <FormattedMessage id="eto.status.onchain.whitelist" />,
  [EEtoStateUIName.CLAIM]: <FormattedMessage id="eto.status.onchain.issuer-withdraw-funds" />,
  [EEtoStateUIName.PAYOUT]: <FormattedMessage id="eto.status.onchain.issuer-withdraw-funds" />,
};

const etoColorToClassName: Record<EEtoStateColor, string> = {
  [EEtoStateColor.BLUE]: styles.blue,
  [EEtoStateColor.ORANGE]: styles.orange,
  [EEtoStateColor.GREEN]: styles.green,
  [EEtoStateColor.RED]: styles.red,
};

const ComingSoonEtoState: React.FunctionComponent<ISizeLayoutProps & CommonHtmlProps> = ({
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
}) => (
  <div
    className={cn(styles.projectStatus, styles.green, size, layout, className)}
    data-test-id="eto-state-coming-soon"
  >
    <FormattedMessage id="eto.status.sub-state.coming-soon" />
  </div>
);

const SuccessEtoState: React.FunctionComponent<ISizeLayoutProps & CommonHtmlProps> = ({
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
}) => (
  <div
    className={cn(styles.projectStatus, styles.green, size, layout, className)}
    data-test-id="eto-state-mock-successful"
  >
    <FormattedMessage id="eto.status.mock.success" />
  </div>
);

const ETOIssuerState: React.FunctionComponent<IExternalProps &
  ISizeLayoutProps &
  CommonHtmlProps> = ({
  eto,
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
}) => {
  const state = etoModuleApi.utils.getEtoCurrentState(eto);
  const stateColor = etoModuleApi.utils.getEtoStateColor(eto);
  const stateUIName = etoModuleApi.utils.getEtoStateUIName(eto);

  return (
    <div
      className={cn(styles.projectStatus, etoColorToClassName[stateColor], size, layout, className)}
      data-test-id={`eto-state-${state}`}
    >
      {issuerOnChainStateToName[stateUIName] ?? generalStateToName[stateUIName]}
    </div>
  );
};

const ETOInvestorState: React.FunctionComponent<IExternalProps &
  ISizeLayoutProps &
  CommonHtmlProps> = ({
  eto,
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
}) => {
  if (etoModuleApi.utils.isComingSoon(eto.state)) {
    return <ComingSoonEtoState />;
  }

  const state = etoModuleApi.utils.getEtoCurrentState(eto);
  const stateColor = etoModuleApi.utils.getEtoStateColor(eto);
  const stateUIName = etoModuleApi.utils.getEtoStateUIName(eto);

  return (
    <div
      className={cn(styles.projectStatus, etoColorToClassName[stateColor], size, layout, className)}
      data-test-id={`eto-state-${state}`}
    >
      {generalStateToName[stateUIName]}
    </div>
  );
};

export { ETOIssuerState, ETOInvestorState, ComingSoonEtoState, SuccessEtoState };
