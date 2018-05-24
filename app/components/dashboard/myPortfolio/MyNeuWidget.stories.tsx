import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { MyNeuWidget } from "./MyNeuWidget";

storiesOf("MyNeuWidget", module)
  .add("with funds", () => <MyNeuWidget balanceNeu="1234567" balanceEur="5947506" />)
  .add("without funds", () => <MyNeuWidget balanceNeu="0" />);
