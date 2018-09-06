import * as React from "react";

import { Footer } from "../Footer";
import { Header } from "../Header";

export const LayoutUnauthorized: React.SFC = ({ children }) => (
  <>
    <Header />

    <div className="wrapper">{children}</div>

    <Footer />
  </>
);
