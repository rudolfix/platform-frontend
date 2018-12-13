import * as React from "react";

import { ModalComponentBody } from "../components/modals/ModalComponentBody";

export const withModalBody = (maxWidth = "37.5rem") => (story: any) => (
  <div style={{ maxWidth }}>
    <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
  </div>
);
