import { noopLogger, TEtoProducts } from "@neufund/shared-modules";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto, testProduct } from "../../../../../test/fixtures";
import { Panel } from "../../../shared/Panel";
import { EtoRegistrationTermsLayout } from "./EtoTerms";

const availableProducts: TEtoProducts = [testProduct];

storiesOf("EtoTerms", module)
  .addDecorator(story => <Panel>{story()}</Panel>)
  .add("default", () => (
    <EtoRegistrationTermsLayout
      availableProducts={availableProducts}
      changeProductType={action("changeProductType")}
      eto={testEto}
      savingData={false}
      readonly={false}
      saveData={action("saveData")}
      logger={noopLogger}
    />
  ));
