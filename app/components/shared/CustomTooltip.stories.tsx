import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "./Buttons";
import { CustomTooltip } from "./CustomTooltip";

import * as icon from "../../assets/img/logo_yellow.svg"

const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, consequatur deserunt voluptatibus sapiente ducimus iusto culpa consectetur minus, voluptatum tempora nostrum quasi, rerum non facilis doloribus tempore ea obcaecati reprehenderit!";

storiesOf("CustomTooltip", module).add("default", () => {
  const target = <img src={icon} />

  return (
    <CustomTooltip isOpen={true} targetNode={target}>
      <div>
        <p>
          <FormattedMessage id="investment-flow.amount-exceeds-investment" />
        </p>
        <p>
          <Button theme="white" className="mr-4" type="submit">
            <FormattedMessage id="investment-flow.max-invest" />
          </Button>
        </p>
      </div>
    </CustomTooltip>
  )});
