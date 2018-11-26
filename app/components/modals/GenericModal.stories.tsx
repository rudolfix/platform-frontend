import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { GenericModalLayout } from "./GenericModal";

storiesOf("GenericModal", module)
  .add("with title", () => (
    <GenericModalLayout
      onClick={action("click")}
      closeModal={action("close")}
      isOpen={true}
      genericModalObj={{
        title: "C'mon, salty pants. you won't loot the quarter-deck.",
      }}
    />
  ))
  .add("with title and description", () => (
    <GenericModalLayout
      onClick={action("click")}
      closeModal={action("close")}
      isOpen={true}
      genericModalObj={{
        title: "C'mon, salty pants. you won't loot the quarter-deck.",
        description:
          "The plunder stutters urchin like a stormy wench. Wave cowardly like a gutless doubloons. Arrr, wet strength!",
      }}
    />
  ))
  .add("with title and check icon", () => (
    <GenericModalLayout
      onClick={action("click")}
      closeModal={action("close")}
      isOpen={true}
      genericModalObj={{
        title: "C'mon, salty pants. you won't loot the quarter-deck.",
        icon: "check",
        description:
          "The plunder stutters urchin like a stormy wench. Wave cowardly like a gutless doubloons. Arrr, wet strength!",
      }}
    />
  ))
  .add("with title and exclamation icon", () => (
    <GenericModalLayout
      onClick={action("click")}
      closeModal={action("close")}
      isOpen={true}
      genericModalObj={{
        title: "C'mon, salty pants. you won't loot the quarter-deck.",
        icon: "exclamation",
        description:
          "The plunder stutters urchin like a stormy wench. Wave cowardly like a gutless doubloons. Arrr, wet strength!",
      }}
    />
  ))
  .add("with custom component", () => {
    const CustomComponent = () => (
      <section>
        <h1>Halitosis, fight, and madness</h1>
        <p>
          Freebooter of a heavy-hearted passion, fear the courage! The wave hails with life, burn
          the lighthouse before it stutters. Planks are the clouds of the clear strength.
        </p>
      </section>
    );

    return (
      <GenericModalLayout
        onClick={action("click")}
        closeModal={action("close")}
        isOpen={true}
        component={CustomComponent}
      />
    );
  });
