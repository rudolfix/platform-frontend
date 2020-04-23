import { Button, ButtonGroup, EButtonLayout } from "@neufund/design-system";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";

import { KYCModal, KYCModalTitle } from "./KYCModal";

storiesOf("molecules|KYC/KycModal", module).add("default", () => (
  <KYCModal
    title={<KYCModalTitle>Kyc Modal Title</KYCModalTitle>}
    isOpen
    onClose={action("CLOSE")}
    footer={
      <ModalFooter>
        <ButtonGroup className="float-right">
          <Button layout={EButtonLayout.SECONDARY} onClick={action("CLOSE")}>
            <FormattedMessage id="form.button.cancel" />
          </Button>

          <Button layout={EButtonLayout.PRIMARY} onClick={action("SAVE")}>
            <FormattedMessage id="form.button.save" />
          </Button>
        </ButtonGroup>
      </ModalFooter>
    }
  >
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
      was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
      passages, and more recently with desktop publishing software like Aldus PageMaker including
      versions of Lorem Ipsum.
    </p>
  </KYCModal>
));
