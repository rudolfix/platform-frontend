import { forEach } from "lodash";
import { formField, tid } from "../utils/selectors";

type TFormFieldFixture =
  | {
      value: string;
      type: "string" | "submit" | "tags" | "file" | "date" | "select" | "check";
    }
  | string;

export type TFormFixture = {
  [fieldIdentifier: string]: TFormFieldFixture;
};

/**
 * Fill out a form
 * @param fixture - Which form fixture to load
 * @param submit - wether to submit the form or not, default true
 */
export const fillForm = (fixture: TFormFixture, submit: boolean = true) => {
  let submitButtonTid = "";
  forEach(fixture, (field, key) => {
    // the default is just typing a string into the input
    if (typeof field === "string") {
      cy.get(formField(key))
        .clear()
        .type(field);
    }
    // date
    else if (field.type === "date") {
      const values = field.value.split("/");
      cy.get(formField(key)).each((subField, index) => {
        cy.wrap(subField).type(values[index]);
      });
    }
    // select field
    else if (field.type === "select") {
      cy.get(formField(key)).select(field.value);
    }
    // click on a field
    else if (field.type === "check") {
      cy.get(formField(key))
        .first()
        .check({ force: true });
    }
    // tags
    else if (field.type === "tags") {
      cy.get(tid(key, "input"))
        .type(field.value, { force: true, timeout: 20 })
        .wait(1000)
        .type("{enter}", { force: true });
    }
    // files
    else if (field.type === "file") {
      uploadFileToFieldWithTid(key, field.value);
      cy.wait(1000);
    }
    // also remember main submitt button
    else if (field.type === "submit") {
      submitButtonTid = key;
    }
  });
  if (submit) {
    cy.get(tid(submitButtonTid)).click();
  }
};

/**
 * Upload a file to a dropzone field
 * @param targetTid - test id of the dropzone field
 * @param fixture - which fixture to load
 */
export const uploadFileToFieldWithTid = (targetTid: string, fixture: string = "example.jpg") => {
  const dropEvent = {
    dataTransfer: {
      files: [] as any,
    },
  };

  cy.fixture(fixture).then(picture => {
    return Cypress.Blob.base64StringToBlob(picture, "image/png").then((blob: any) => {
      dropEvent.dataTransfer.files.push(blob);
    });
  });

  cy.get(tid(targetTid)).trigger("drop", dropEvent);
};
