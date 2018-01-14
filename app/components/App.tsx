import * as React from "react";
import { NavbarBrand, Navbar } from "reactstrap";
import { Route } from "react-router-dom";

import { Home } from "./Home";
import { Success } from "./Success";

export const App = () => (
  <div>
    <Navbar color="primary" dark>
      <NavbarBrand href="/">Neufund Platform</NavbarBrand>
    </Navbar>

    <Route path="/" component={Home} exact />
    <Route path="/success" component={Success} exact />
  </div>
);
