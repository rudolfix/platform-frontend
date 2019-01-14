import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../../../appRoutes";
import { ButtonLink } from "../../../shared/buttons";
import { EtoWidgetContext } from "../../EtoWidgetView";

import * as styles from "./RegisterNowWidget.module.scss";

const RegisterNowWidget: React.SFC = () => (
  <EtoWidgetContext.Consumer>
    {previewCode => (
      <div className={styles.registerNow}>
        <div>
          <FormattedMessage id="shared-component.eto-overview.register-cta" />
        </div>
        <ButtonLink
          innerClassName="mt-3"
          to={appRoutes.register}
          data-test-id="logged-out-campaigning-register"
          target={previewCode ? "_blank" : ""}
        >
          <FormattedMessage id="shared-component.eto-overview.register" />
        </ButtonLink>
      </div>
    )}
  </EtoWidgetContext.Consumer>
);

export { RegisterNowWidget };
