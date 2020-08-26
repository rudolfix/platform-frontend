import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EProcessState } from "../../../../utils/enums/processStates";
import { GovernanceUpdateModal } from "./GovernanceUpdateModal";

const governanceUpdateTitleForm = {
  fields: {
    updateTitle: {
      value: "",
      errors: [],
      isValid: false,
      showErrors: false,
      disabled: false,
      validations: [],
      id: "asdfasdf",
    },
  },
  errors: [],
  isValid: false,
  showErrors: false,
  disabled: false,
  validations: [],
  id: "asdfasdf",
};

const documentUploadState = {
  documentUploadStatus: EProcessState.NOT_STARTED as const,
};

storiesOf("Governance/GeneralInformation", module).add(
  "GovernanceUpdateModal: initial state",
  () => (
    <GovernanceUpdateModal
      publishUpdate={action("publishUpdate")}
      uploadFile={action("uploadFile")}
      removeFile={action("removeFile")}
      closeGovernanceUpdateModal={action("closeGovernanceUpdateModal")}
      publishButtonDisabled={true}
      onFormChange={action("onFormChange")}
      onFormBlur={action("onFormBlur")}
      governanceUpdateTitleForm={governanceUpdateTitleForm}
      documentUploadState={documentUploadState}
    />
  ),
);
