import * as React from "react";
import { Row } from "reactstrap";
import * as mailLink from "../../../assets/img/mail_link.svg";

export const MissingEmailLightWallet: React.SFC<any> = () => {
  return (
    <>
      <Row className="justify-content-center mt-5 mb-5">
        <img src={mailLink} className="text-center" />
      </Row>
      <p className="text-center font-weight-bold">
        In order to login to your NEUFUND wallet, please click on the link in your email with the
        subject "Welcome to Neufund"
      </p>
    </>
  );
};
