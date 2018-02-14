import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

interface IProps {}

export const StartCompanyKYCComponent: React.SFC<IProps> = () => (
  <div>
    <h1>Start Company</h1>
  </div>
);

export const StartCompanyKYC = compose<React.SFC>(appConnect<IProps>({}))(StartCompanyKYCComponent);
