import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../../../lib/api/users/interfaces";
import { accountMenuData } from "./MenuData";
import { Menu } from "./MyAccountMenu";

const issuerData = accountMenuData(false, () => false, EUserType.ISSUER, action("logout"));

storiesOf("MyAccount menu", module).add("default", () => <Menu data={issuerData} />);
