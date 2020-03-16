import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EProcessState } from "../../../../../utils/enums/processStates";
import { withModalBody } from "../../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { SignNomineeISHASummaryLayout } from "./SignISHASummary";

storiesOf("NomineeSignISHA/Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <SignNomineeISHASummaryLayout
      onAccept={action("onAccept")}
      previewCode={"123"}
      uploadState={EProcessState.SUCCESS}
      uploadedFileName={"test_file_name"}
      startDocumentRemove={action("startDocumentRemove")}
      onDropFile={action("onDropFile")}
    />
  ))
  .add("error", () => (
    <SignNomineeISHASummaryLayout
      onAccept={action("onAccept")}
      previewCode={"123"}
      uploadState={EProcessState.ERROR}
      uploadedFileName={"test_file_name"}
      startDocumentRemove={action("startDocumentRemove")}
      onDropFile={action("onDropFile")}
    />
  ))
  .add("error with long file name", () => (
    <SignNomineeISHASummaryLayout
      onAccept={action("onAccept")}
      previewCode={"123"}
      uploadState={EProcessState.ERROR}
      uploadedFileName={
        "this_file_have_long_name_maybe_not_so_long_but_it_should_not_break_modal_anymore_and_have_even_hash_in_name_0x124125AE438b97b795fcD39D15A47CAf831BE322"
      }
      startDocumentRemove={action("startDocumentRemove")}
      onDropFile={action("onDropFile")}
    />
  ));
