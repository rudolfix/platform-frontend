import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../../../lib/api/users/interfaces";
import { accountMenuData } from "./MenuData";
import { Menu } from "./MobileMenu";

const issuerData = accountMenuData(false, () => false, EUserType.ISSUER, action("logout"));

storiesOf("Mobile menu", module).add("default", () => <Menu data={issuerData} />);
