import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "./buttons";
import { CustomTooltip, ECustomTooltipTextPosition } from "./CustomTooltip";

import * as icon from "../../assets/img/logo_yellow.svg";

storiesOf("Basic UI/CustomTooltip", module)
  .add("default", () => (
    <div style={{ margin: "0 10em 10em" }}>
      <img id="tooltip-target1" src={icon} />
      <CustomTooltip isOpen={true} target="tooltip-target1">
        <p>
          <FormattedMessage id="investment-flow.amount-exceeds-investment" />
        </p>
        <div>
          <Button theme="white" type="submit">
            <FormattedMessage id="investment-flow.max-invest" />
          </Button>
        </div>
      </CustomTooltip>
    </div>
  ))
  .add("placement right", () => (
    <div style={{ margin: "10em" }}>
      <img id="tooltip-target2" src={icon} />
      <CustomTooltip isOpen={true} target="tooltip-target2" placement="right">
        <FormattedMessage id="investment-flow.amount-exceeds-investment" />
      </CustomTooltip>
    </div>
  ))
  .add("placement left", () => (
    <div style={{ margin: "10em" }}>
      <img id="tooltip-target3" src={icon} style={{ marginLeft: "20em" }} />
      <CustomTooltip isOpen={true} target="tooltip-target3" placement="left">
        <FormattedMessage id="investment-flow.amount-exceeds-investment" />
      </CustomTooltip>
    </div>
  ))
  .add("placement top", () => (
    <div style={{ margin: "10em" }}>
      <img id="tooltip-target4" src={icon} />
      <CustomTooltip isOpen={true} target="tooltip-target4" placement="top">
        <FormattedMessage id="investment-flow.amount-exceeds-investment" />
      </CustomTooltip>
    </div>
  ))
  .add("text left", () => (
    <div style={{ margin: "0 10em 10em" }}>
      <img id="tooltip-target4" src={icon} />
      <CustomTooltip
        isOpen={true}
        target="tooltip-target4"
        textPosition={ECustomTooltipTextPosition.LEFT}
      >
        <FormattedMessage id="investment-flow.amount-exceeds-investment" />
      </CustomTooltip>
    </div>
  ));
