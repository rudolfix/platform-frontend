import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { EEtoState } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { EUserType } from "../../../lib/api/users/interfaces";
import { selectUserType } from "../../../modules/auth/selectors";
import { selectIssuerEtoPreviewCode } from "../../../modules/eto-flow/selectors";
import { selectEtoOnChainStateById } from "../../../modules/eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { TDataTestId } from "../../../types";
import { selectBaseUrl } from "../../../utils/locationUtils";
import { Container, EColumnSpan } from "../../layouts/Container";
import { ExternalLink } from "../../shared/links/ExternalLink";

import infoIcon from "../../../assets/img/notifications/info.svg";
import * as styles from "./CoverBanner.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
}

interface IJurisdictionBannerProps {
  jurisdiction?: EJurisdiction;
  etoStateOnChain?: EETOStateOnChain;
}

interface IInvestorPreviewProps {
  previewCode?: string;
  origin: string;
}

type TBannerProps = IInvestorPreviewProps | IJurisdictionBannerProps;

const BannerBase: React.FunctionComponent<TDataTestId> = ({
  children,
  "data-test-id": dataTestId,
}) => (
  <Container
    columnSpan={EColumnSpan.THREE_COL}
    className={styles.jurisdictionBanner}
    data-test-id={dataTestId}
  >
    <img src={infoIcon} className={styles.icon} alt="" />
    {children}
  </Container>
);

export const InvestorBannerLayout: React.FunctionComponent<IJurisdictionBannerProps &
  IExternalProps> = ({ eto, jurisdiction, etoStateOnChain }) => {
  if (jurisdiction !== EJurisdiction.GERMANY && jurisdiction !== EJurisdiction.LIECHTENSTEIN) {
    return null;
  }

  let message;

  const toBeOffered = [EEtoState.PREVIEW, EEtoState.PENDING, EEtoState.LISTED].includes(eto.state);
  const currentlyOffered =
    eto.state === EEtoState.PROSPECTUS_APPROVED ||
    (eto.state === EEtoState.ON_CHAIN &&
      (etoStateOnChain || EETOStateOnChain.Setup) < EETOStateOnChain.Signing);

  if (toBeOffered) {
    message =
      jurisdiction === EJurisdiction.GERMANY ? (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.de.to-be" />
      ) : (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.li.to-be" />
      );
  } else if (currentlyOffered) {
    message =
      jurisdiction === EJurisdiction.GERMANY ? (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.de.currently" />
      ) : (
        <FormattedMessage id="eto-overview.cover-banner.jurisdiction.li.currently" />
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
    <BannerBase data-test-id={`eto.public-view.jurisdiction-banner.${jurisdiction}`}>
      {message}
    </BannerBase>
  );
};

export const IssuerBannerLayout: React.FunctionComponent<IInvestorPreviewProps> = ({
  previewCode,
  origin,
}) => (
  <BannerBase data-test-id="eto.public-view.investor-preview-banner">
    <FormattedMessage
      tagName="span"
      id="eto-overview.cover-banner.go-to-investor-view"
      values={{
        viewAsInvestor: (
          <ExternalLink
            data-test-id="eto.public-view.investor-preview-banner.view-as-investor"
            href={`${origin}/eto/view/${previewCode}`}
          >
            <FormattedMessage id="eto-overview.cover-banner.view-as-investor" />
          </ExternalLink>
        ),
      }}
    />
  </BannerBase>
);

export const CoverBanner = compose<IExternalProps & TBannerProps, IExternalProps & TBannerProps>(
  appConnect<TBannerProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const userType = selectUserType(state);

      if (userType === EUserType.ISSUER && !props.publicView) {
        return {
          userType,
          origin: selectBaseUrl(),
          previewCode: selectIssuerEtoPreviewCode(state),
        };
      } else {
        return {
          userType,
          jurisdiction: props.eto.product.jurisdiction,
          etoStateOnChain: selectEtoOnChainStateById(state, props.eto.etoId),
        };
      }
    },
  }),
  branch<{ userType: EUserType; publicView: boolean }>(
    props => props.userType === EUserType.ISSUER && !props.publicView,
    renderComponent(IssuerBannerLayout),
  ),
)(InvestorBannerLayout);
