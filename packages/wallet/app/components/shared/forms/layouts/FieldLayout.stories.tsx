import { action } from "@storybook/addon-actions";
import * as React from "react";
import { storiesOf } from "@storybook/react-native";

import { EFieldType, FieldLayout } from "./FieldLayout";

const selectListItems = [
  {
    id: "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3",
    title: "INV_ETH_ICBM_NO_KYC",
    subTitle: "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3",
  },
  {
    id: "0xDE185A5c2Bd3913fAC1F64102e3DEFD9E1797C4d",
    title: "INV_ETH_EUR_ICBM_KYC_ICBM_UNLOCK",
    subTitle: "0xDE185A5c2Bd3913fAC1F64102e3DEFD9E1797C4d",
  },
  {
    id: "0xBA9807E260E1E162F46a5ACd228153EdFE2604eC",
    title: "INV_ETH_ICBM_NO_KYC_2",
    subTitle: "0xBA9807E260E1E162F46a5ACd228153EdFE2604eC",
  },
  {
    id: "0x844C5c9cE2Ad620592A5D686Fc8e76866f039c56",
    title: "INV_ETH_ICBM_HAS_KYC",
    subTitle: "0x844C5c9cE2Ad620592A5D686Fc8e76866f039c56",
  },
];

storiesOf("Molecules|FieldLayout", module)
  .add("input", () => (
    <FieldLayout
      label="User name"
      type={EFieldType.INPUT}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ))
  .add("input without label", () => (
    <FieldLayout
      type={EFieldType.INPUT}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ))
  .add("invalid input", () => (
    <FieldLayout
      label="User name"
      type={EFieldType.INPUT}
      value="desfero"
      helperText="It's an important information for us to provide the best user experience"
      errorMessage="User name already in use"
    />
  ))
  .add("disabled input", () => (
    <FieldLayout label="User name" type={EFieldType.INPUT} disabled={true} value="desfero" />
  ))
  .add("textarea ", () => (
    <FieldLayout
      label="User name"
      type={EFieldType.TEXT_AREA}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ))
  .add("select list ", () => (
    <FieldLayout
      label="User name"
      type={EFieldType.SELECT_LIST}
      selectedItemId="0xBA9807E260E1E162F46a5ACd228153EdFE2604eC"
      items={selectListItems}
      helperText="It's an important information for us to provide the best user experience"
      onChangeItem={action("onChangeItem")}
    />
  ))
  .add("select list without label and helper text", () => (
    <FieldLayout
      type={EFieldType.SELECT_LIST}
      selectedItemId="0xBA9807E260E1E162F46a5ACd228153EdFE2604eC"
      items={selectListItems}
      onChangeItem={action("onChangeItem")}
    />
  ))
  .add("select list disabled", () => (
    <FieldLayout
      disabled={true}
      type={EFieldType.SELECT_LIST}
      selectedItemId="0xBA9807E260E1E162F46a5ACd228153EdFE2604eC"
      items={selectListItems}
      onChangeItem={action("onChangeItem")}
    />
  ));
