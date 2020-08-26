import { VirtualizedSelect } from "@neufund/design-system";
import * as React from "react";

import { TAppRoute } from "../../appRoutes";
import { GovernancePages } from "./constants";

import styles from "./GeneralInformation/GeneralInformation.module.scss";

type TOptionType = { label: string; value: string };

type TProps = {
  value: TAppRoute;
  onChange: (to: string) => void;
};

export const GovernancePageSelect: React.FunctionComponent<TProps> = props => (
  <VirtualizedSelect
    className={styles.select as string}
    options={[GovernancePages[0], GovernancePages[1]].map(
      page =>
        ({
          label: page.label,
          value: page.to as string,
        } as TOptionType),
    )}
    value={props.value}
    searchable={false}
    clearable={false}
    onChange={(selectedOption: unknown) => {
      const value = (selectedOption as TOptionType).value;
      props.onChange(value);
    }}
  />
);
