import { Button, EButtonLayout, InlineIcon } from "@neufund/design-system";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import {
  selectMessageSigningError,
  selectWalletConnectError,
} from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { Container, EColumnSpan } from "../../layouts/Container";
import { EContentWidth } from "../../layouts/Content";
import { Layout, TContentExternalProps } from "../../layouts/Layout";
import { WidgetGrid } from "../../layouts/WidgetGrid";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { Heading } from "../../shared/Heading";
import { withContainer } from "../../shared/hocs/withContainer";
import { ExternalLink } from "../../shared/links";
import { EWarningAlertSize, WarningAlert } from "../../shared/WarningAlert";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";

import wcLogo from "../../../assets/img/inline_icons/wc_logo.svg";
import * as styles from "./WalletConnect.module.scss";

type TStateProps = {
  error: TMessage | undefined;
};

type TDispatchProps = {
  walletConnectStart: () => void;
};

type TComponentProps = {
  error: TMessage | undefined;
  walletConnectStart: () => void;
};

export const WalletConnectLayout: React.FunctionComponent<TComponentProps> = ({
  walletConnectStart,
  error,
}) => (
  <WidgetGrid>
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <div className={styles.betaLabel}>
        <FormattedMessage id="beta-label" />
      </div>
      <Heading level={2} decorator={false} disableTransform={true}>
        <FormattedHTMLMessage tagName="span" id="wallet-connect.title" />
      </Heading>
      <p className={styles.description}>
        <FormattedMessage id="wallet-connect.description-1" />
        <ExternalLink href={externalRoutes.walletConnectLandingPage}>
          <FormattedMessage id="wallet-connect.description-2" />
        </ExternalLink>
      </p>
      {error && (
        <WarningAlert size={EWarningAlertSize.BIG} className={styles.error}>
          {getMessageTranslation(error)}
        </WarningAlert>
      )}
      <Button
        layout={EButtonLayout.PRIMARY}
        type="button"
        onClick={walletConnectStart}
        className={styles.button}
      >
        <InlineIcon svgIcon={wcLogo} className={styles.buttonIcon} />
        <FormattedMessage id="wallet-connect.start" />
      </Button>
      <div className={styles.divider} />
      <p className={styles.betaTestingMessage}>
        <FormattedMessage id="wallet-connect.beta-testing-message-1" />
        <ExternalLink href={externalRoutes.neufundSupportNewTicket}>
          <FormattedMessage id="wallet-connect.beta-testing-message-2" />
        </ExternalLink>
        <FormattedMessage id="wallet-connect.beta-testing-message-3" />
      </p>
    </Container>
  </WidgetGrid>
);

export const WalletConnect = compose<TStateProps & TDispatchProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      error: selectWalletConnectError(state) || selectMessageSigningError(state),
    }),
    dispatchToProps: dispatch => ({
      walletConnectStart: () => dispatch(actions.walletSelector.walletConnectStart()),
      walletConnectStop: () => dispatch(actions.walletSelector.walletConnectStop()),
    }),
  }),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(Layout),
  ),
)(WalletConnectLayout);
