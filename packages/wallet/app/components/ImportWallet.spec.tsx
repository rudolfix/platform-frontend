import * as React from "react";
import { render } from "@testing-library/react-native";

import { ImportWallet } from "./ImportWallet";

describe("ImportWallet", () => {
  it("should render 'import-wallet' tid", () => {
    const { queryByTestId } = render(<ImportWallet />);

    expect(queryByTestId("import-wallet")).toBeTruthy();
  });
});
