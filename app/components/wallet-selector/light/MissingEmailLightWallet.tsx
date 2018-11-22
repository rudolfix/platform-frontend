import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { Row } from "reactstrap";

import { recoverRoutes } from "../wallet-recover/recoverRoutes";

import * as mailLink from "../../../assets/img/mail_link.svg";

export const MissingEmailLightWallet: React.SFC<{}> = () => {
  return (
    <>
      <Row className="justify-content-center mt-5 mb-5">
        <img src={mailLink} className="text-center" />
      </Row>
      <p className="text-center font-weight-bold" data-test-id="neuwallet-missing-email">
        <FormattedHTMLMessage
          tagName="div"
          id="wallet-selector.neuwallet.login-instructions"
          values={{ url: recoverRoutes.help }}
        />
      </p>
    </>
  );
};
