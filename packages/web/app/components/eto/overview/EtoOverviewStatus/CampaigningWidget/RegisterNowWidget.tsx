import { WholeEur } from "@neufund/design-system";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../../../../appRoutes";
import { ButtonLink } from "../../../../shared/buttons";
import { Message } from "../Message";

type TExternalProps = {
  isEmbedded: boolean;
  pledgedAmount: number;
  investorsCount: number | undefined;
};

const RegisterNowWidget: React.FunctionComponent<TExternalProps> = ({
  isEmbedded,
  investorsCount,
  pledgedAmount,
}) => {
  const wasPledged = investorsCount && investorsCount !== 0;

  return (
    <Message
      data-test-id="eto-overview-status-whitelisting-suspended"
      title={
        wasPledged ? (
          <FormattedMessage
            id="shared-component.eto-overview.register-cta.title-pledged"
            values={{
              totalAmount: (
                <WholeEur value={pledgedAmount ? pledgedAmount.toString() : undefined} />
              ),
              totalInvestors: investorsCount,
            }}
          />
        ) : (
          undefined
        )
      }
      summary={
        <FormattedHTMLMessage
          id="shared-component.eto-overview.register-cta.summary"
          tagName="span"
        />
      }
    >
      <ButtonLink
        className="mt-3"
        to={appRoutes.register}
        data-test-id="logged-out-campaigning-register"
        target={isEmbedded ? "_blank" : ""}
      >
        <FormattedMessage id="shared-component.eto-overview.register" />
      </ButtonLink>
    </Message>
  );
};

export { RegisterNowWidget };
