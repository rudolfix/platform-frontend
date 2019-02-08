import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ESectionHeaderSize, SectionHeader } from "./SectionHeader";

import * as neuIcon from "../../assets/img/neu_icon.svg";

storiesOf("Basic UI/SectionHeader", module)
  .add("layout: has decorator", () => <SectionHeader>Lorem Ipsum</SectionHeader>)
  .add("layout: has decorator and description", () => (
    <SectionHeader description={"No causae vocibus dissentiet pro, id sed diceret blandit."}>
      Lorem Ipsum
    </SectionHeader>
  ))
  .add("layout: has icon", () => <SectionHeader decorator={neuIcon}>Lorem Ipsum</SectionHeader>)
  .add("layout: without decorator", () => (
    <SectionHeader decorator={false}>Lorem Ipsum</SectionHeader>
  ))
  .add("layout: without decorator and with description", () => (
    <SectionHeader
      decorator={false}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </SectionHeader>
  ))
  .add("size small, without decorator and with description", () => (
    <SectionHeader
      size={ESectionHeaderSize.SMALL}
      decorator={false}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </SectionHeader>
  ))
  .add("size small, with decorator and description", () => (
    <SectionHeader
      size={ESectionHeaderSize.SMALL}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </SectionHeader>
  ))
  .add("size small and with icon", () => (
    <SectionHeader size={ESectionHeaderSize.SMALL} decorator={neuIcon}>
      Lorem Ipsum
    </SectionHeader>
  ));
