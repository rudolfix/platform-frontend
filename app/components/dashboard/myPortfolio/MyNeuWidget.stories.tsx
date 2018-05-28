import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { Q18 } from "../../../config/constants";
import { MyNeuWidget } from "./MyNeuWidget";

storiesOf("MyNeuWidget", module)
  .add("with funds", () => <MyNeuWidget balanceNeu={`123${Q18.toString()}`} balanceEur="5947506" />)
  .add("without funds", () => <MyNeuWidget balanceNeu="0" />);
