import { storiesOf } from "@storybook/react";
import * as React from "react";

import { HeaderComponent } from "./Header";

storiesOf("Header", module)
  .add("investor", () => (
    <>
      <HeaderComponent
        isAuthorized={false}
        logout={() => {}}
        location={"foo"}
        userType="investor"
      />
      <br />
      <HeaderComponent isAuthorized={true} logout={() => {}} location={"foo"} userType="investor" />
    </>
  ))
  .add("issuer", () => (
    <>
      <HeaderComponent isAuthorized={false} logout={() => {}} location={"foo"} userType="issuer" />
      <br />
      <HeaderComponent isAuthorized={true} logout={() => {}} location={"foo"} userType="issuer" />
    </>
  ));
