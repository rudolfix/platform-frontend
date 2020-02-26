import * as React from "react";
import { storiesOf } from "@storybook/react";
import { InlineBlockWrapper, PaddedWrapper } from "../../storybook-decorators";
import { VirtualizedSelect } from "./VirtualizedSelect";

storiesOf("NDS|Molecules/Inputs", module).add("VirtualizedSelect", () => (
  <PaddedWrapper>
    <InlineBlockWrapper style={{ width: "300px" }}>
      <VirtualizedSelect
        options={[
          { label: "Apple", value: "apple" },
          { label: "Ball", value: "ball" },
          { label: "Cat", value: "cat" },
          { label: "Doll", value: "doll" },
        ]}
      />
    </InlineBlockWrapper>
  </PaddedWrapper>
));
