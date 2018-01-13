import * as React from "react";
import { NavbarBrand, Navbar } from "reactstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Home } from "./Home";

// @note: this is done to make HMR work with react router. In production build its gone.
function forceRerenderInDevMode(): number {
  if (process.env.NODE_ENV === "development") {
    return Math.random();
  } else {
    return 1;
  }
}

export const App = () => (
  <Router key={forceRerenderInDevMode()}>
    <div>
      <Navbar color="primary" dark>
        <NavbarBrand href="/">Neufund Platform</NavbarBrand>
      </Navbar>

      <Route path="/" component={Home} exact />
    </div>
  </Router>
);
