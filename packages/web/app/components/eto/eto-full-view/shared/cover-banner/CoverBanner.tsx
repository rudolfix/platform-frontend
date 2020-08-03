import { EEtoState, EETOStateOnChain, EJurisdiction } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CoverBannerBase } from "./CoverBannerBase";

interface IJurisdictionBannerProps {
  jurisdiction: EJurisdiction;
  etoState: EEtoState;
  etoStateOnChain: EETOStateOnChain | undefined;
}

export const CoverBanner: React.FunctionComponent<IJurisdictionBannerProps> = ({
  jurisdiction,
  etoState,
  etoStateOnChain,
}) => {
  if (jurisdiction !== EJurisdiction.GERMANY && jurisdiction !== EJurisdiction.LIECHTENSTEIN) {
    return null;
  }

  let message;

  const toBeOffered = [EEtoState.PREVIEW, EEtoState.PENDING, EEtoState.LISTED].includes(etoState);
  const currentlyOffered =
    etoState === EEtoState.PROSPECTUS_APPROVED ||
    (etoState === EEtoState.ON_CHAIN &&
      (etoStateOnChain || EETOStateOnChain.Setup) < EETOStateOnChain.Signing);

  if (toBeOffered) {
    message =
      jurisdiction === EJurisdiction.GERMANY ? (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.de.to-be-offered" />
      ) : (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.li.to-be-offered" />
      );
  } else if (currentlyOffered) {
    message =
      jurisdiction === EJurisdiction.GERMANY ? (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.de.currently-offered" />
      ) : (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.li.currently-offered" />
      );
  } else {
    message =
      jurisdiction === EJurisdiction.GERMANY ? (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.de.offered" />
      ) : (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.li.offered" />
      );
  }
  return (
    <CoverBannerBase data-test-id={`eto.public-view.jurisdiction-banner.${jurisdiction}`}>
      {message}
    </CoverBannerBase>
  );
};
