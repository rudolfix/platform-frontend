import { storiesOf } from "@storybook/react";
import * as React from "react";

import { mockedStore } from "../../../../../test/fixtures/mockedStore";
import {
  EGovernanceAction,
  EModalState,
  EResolutionState,
  TGovernanceViewState,
  TResolution,
} from "../../../../modules/governance/types";
import { EProcessState } from "../../../../utils/enums/processStates";
import { withStore } from "../../../../utils/react-connected-components/storeDecorator.unsafe";
import { Container, EColumnSpan } from "../../../layouts/Container";
import { GeneralInformation } from "./GeneralInformation";

const initialGovernanceState: TGovernanceViewState = {
  tabVisible: false,
  processState: EProcessState.SUCCESS,
  resolutions: [],
  companyBrandName: "TestCompany GmbH",
  governanceUpdateModalState: {
    modalState: EModalState.CLOSED,
  },
};

const testResolutions: TResolution[] = [
  {
    resolutionState: EResolutionState.BASIC,
    action: EGovernanceAction.REGISTER_OFFER,
    id: "0x642f1abab6a3bf50045490997b35edc3578372c994e8111062968205c0cd1a59",
    draft: false,
    startedAt: new Date("2020-04-18T14:17:48.000Z"),
  },
  {
    resolutionState: EResolutionState.BASIC,
    action: EGovernanceAction.COMPANY_NONE,
    id: "0x57cd9bf3f51b148c4b1e353719485a92f81ffcc3824a9b628446b0f4e4f01a6b",
    draft: false,
    startedAt: new Date("2020-07-07T02:17:56.000Z"),
  },
  {
    resolutionState: EResolutionState.BASIC,
    action: EGovernanceAction.ANNUAL_GENERAL_MEETING,
    id: "0x880b841d14fcd67b241bd96e031b0af256d80778605e17508cfa6711ce0e296d",
    draft: false,
    startedAt: new Date("2020-07-07T02:17:56.000Z"),
  },
  {
    resolutionState: EResolutionState.BASIC,
    action: EGovernanceAction.COMPANY_NONE,
    id: "0x3362643939326236333937396432626164393337633636633362333465623663",
    draft: false,
    startedAt: new Date("2020-07-07T12:06:49.000Z"),
  },
];

const withGovernance = (resolutions: TResolution[] | undefined) => {
  const governanceState = {
    governance: {
      ...initialGovernanceState,
      resolutions,
    },
  };
  return withStore({ ...mockedStore, ...governanceState })(() => (
    <Container columnSpan={EColumnSpan.TWO_COL}>
      <GeneralInformation />
    </Container>
  ));
};

storiesOf("Governance/GeneralInformation", module)
  .add("loading", () => withGovernance(undefined))
  .add("empty", () => withGovernance([]))
  .add("with files", () => withGovernance(testResolutions));
