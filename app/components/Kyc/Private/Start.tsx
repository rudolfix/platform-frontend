import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

interface IProps {}

export const StartPrivateKYCComponent: React.SFC<IProps> = () => (
  <div>
    <h1>Start Private</h1>
  </div>
);

export const StartPrivateKYC = compose<React.SFC>(appConnect<IProps>({}))(StartPrivateKYCComponent);
