import * as React from "react";

import { issuerMenuData } from "../MenuData";
import { MenuEntry } from "../MenuEntry";
import { connectIssuerMenu, IIssuerMenuProps } from "../utils";

import * as styles from "./Menu.module.scss";

const IssuerMenuLayout: React.FunctionComponent<IIssuerMenuProps> = ({
  userHasKycAndVerifiedEmail,
  enableGovernanceTab,
}) => {
  const data = issuerMenuData(userHasKycAndVerifiedEmail, enableGovernanceTab);
  return (
    <div className={styles.menu}>
      {data.map(entry => (
        <MenuEntry {...entry} />
      ))}
    </div>
  );
};

export const IssuerMenu = connectIssuerMenu<{}>(IssuerMenuLayout);
