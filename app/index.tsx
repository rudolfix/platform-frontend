import "./styles/bootstrap.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";

function renderApp(Component: React.SFC<any>): void {
  const mountNode = document.getElementById("app");
  ReactDOM.render(<Component />, mountNode);
}

if (process.env.NODE_ENV === "development") {
  if ((module as any).hot) {
    (module as any).hot.accept("./components/App", () => {
      const { App } = require("./components/App");
      renderApp(App);
    });
  }
}

renderApp(App);
