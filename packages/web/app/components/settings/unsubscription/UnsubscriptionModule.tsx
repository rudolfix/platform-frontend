import { Button, EButtonLayout } from "@neufund/design-system";
import { DynamicModuleLoader } from "@neufund/sagas";
import { isEmail } from "@neufund/shared";
import { marketingEmailsModuleApi, setupMarketingEmailsModule } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, withProps } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Heading } from "../../shared/Heading";
import { ExternalLink } from "../../shared/links/ExternalLink";

import * as styles from "./UnsubscriptionModule.module.scss";

interface IRouterParams {
  email: string;
}

interface IStateProps {
  unsubscriptionLink: string | undefined;
}

interface IDispatchProps {
  unsubscribe: () => void;
  goToHome: () => void;
}

type TComponentProps = IRouterParams & IStateProps & IDispatchProps;

const UnsubscriptionLayout: React.FunctionComponent<TComponentProps> = ({ email, unsubscribe }) => (
  <section className={styles.container} data-test-id="unsubscription.confirmation">
    <Heading level={1} titleClassName={styles.header} decorator={false}>
      <FormattedMessage id="settings.unsubscription.confirmation" />
    </Heading>

    <p className={styles.description}>
      <FormattedMessage
        id="settings.unsubscription.confirmation.description"
        values={{
          email: <strong data-test-id="unsubscription.confirmation.email">{email}</strong>,
        }}
        tagName="span"
      />
    </p>

    <Button
      layout={EButtonLayout.PRIMARY}
      onClick={unsubscribe}
      data-test-id="unsubscription.confirmation.confirm"
    >
      <FormattedMessage id="settings.unsubscription.button" />
    </Button>
  </section>
);

const UnsubscriptionInvalidLayout: React.FunctionComponent<TComponentProps> = ({ goToHome }) => (
  <section className={styles.container} data-test-id="unsubscription.invalid-confirmation-url">
    <Heading level={1} titleClassName={styles.header} decorator={false}>
      <FormattedMessage id="settings.unsubscription.invalid" />
    </Heading>

    <p className={styles.description}>
      <FormattedMessage
        id="settings.unsubscription.invalid.description"
        values={{
          supportDesk: (
            <ExternalLink href={externalRoutes.neufundSupportHome}>
              <FormattedMessage id="support-desk.link.text" />
            </ExternalLink>
          ),
        }}
      />
    </p>

    <Button onClick={goToHome} layout={EButtonLayout.PRIMARY}>
      <FormattedMessage id="settings.unsubscription.visit" />
    </Button>
  </section>
);

const UnsubscriptionComposed = compose<TComponentProps, IRouterParams>(
  appConnect<IStateProps, IDispatchProps, {}, typeof setupMarketingEmailsModule>({
    stateToProps: s => ({
      unsubscriptionLink: marketingEmailsModuleApi.selectors.selectUnsubscriptionLinkFromQueryString(
        s,
      ),
    }),
    dispatchToProps: dispatch => ({
      unsubscribe: () => dispatch(marketingEmailsModuleApi.actions.unsubscribe()),
      goToHome: () => dispatch(actions.routing.goHome()),
    }),
  }),
  withProps((props: IRouterParams) => ({
    email: decodeURIComponent(props.email),
  })),
  branch<IRouterParams & IStateProps>(
    props => !isEmail(props.email),
    renderComponent(UnsubscriptionInvalidLayout),
  ),
  branch<IRouterParams & IStateProps>(
    props =>
      !props.unsubscriptionLink ||
      !marketingEmailsModuleApi.utils.isValidLink(props.unsubscriptionLink),
    renderComponent(UnsubscriptionInvalidLayout),
  ),
)(UnsubscriptionLayout);

const UnsubscriptionModule: React.FunctionComponent<IRouterParams> = props => (
  <DynamicModuleLoader modules={[setupMarketingEmailsModule()]}>
    <UnsubscriptionComposed {...props} />
  </DynamicModuleLoader>
);

export { UnsubscriptionModule, UnsubscriptionInvalidLayout, UnsubscriptionLayout };
