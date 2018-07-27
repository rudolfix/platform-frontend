import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Tooltip } from "./Tooltip";

const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, consequatur deserunt voluptatibus sapiente ducimus iusto culpa consectetur minus, voluptatum tempora nostrum quasi, rerum non facilis doloribus tempore ea obcaecati reprehenderit!";

storiesOf("Tooltip", module).add("default", () => (
  <div>
    <br />
    <br />
    <br />
    <br />
    <Tooltip content={lorem} />
  </div>
));
