import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { GenericModalLayout } from "../modals/GenericModal";
import { ICBMWalletHelpTextModal } from "./ICBMWalletHelpTextModal";

storiesOf("ICBMWalletHelpTextModal", module)
  .addDecorator(story => (
    <GenericModalLayout closeModal={action("closeModal")} component={story as any} isOpen />
  ))
  .add("default", () => <ICBMWalletHelpTextModal />);
