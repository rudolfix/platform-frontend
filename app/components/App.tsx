import * as React from "react";
import { Route } from "react-router-dom";
import { Navbar, NavbarBrand } from "reactstrap";

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
