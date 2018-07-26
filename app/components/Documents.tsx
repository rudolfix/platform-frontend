import * as React from "react";
import { Col, Row } from "reactstrap";

import { FormattedMessage } from "react-intl";
import { LayoutAuthorized } from "./layouts/LayoutAuthorized";
import { DocumentTile } from "./shared/Document";
import { SectionHeader } from "./shared/SectionHeader";

import * as styles from "./Documents.module.scss";
import { SingleColDocumentsWidget } from "./shared/singleColDocumentWidget";

const documents = [
  {
    title: "Term Sheat",
    url: "example.pdf",
  },
  {
    title: "Info Blatt",
    url: "example.doc",
  },
  {
    title: "Bafin Prospectus",
    url: "",
  },
];
const documentsData = [
  {
    name: "AGREEMENT AND PROSPECTUS TEMPLATES",
    documents: [
      {
        name: "test file sdafasdf asd",
        url: "",
      },
      {
        name: "test file fdag hasf",
        url: "test.pdf",
      },
      {
        name: "test file asdf gasd",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.pdf",
      },
    ],
  },
];

export const GeneratedDocuments: React.SFC<{ title: string; url: string }> = ({ title, url }) => {
  return (
    <Col xs={6} md={3} key={url} className="mb-4">
      <DocumentTile title={title} extension={url} />
    </Col>
  );
};

export const Documents: React.SFC = () => (
  <LayoutAuthorized>
    <Row>
      <Col xs={12} md={8}>
        <SectionHeader className="my-4">
          <FormattedMessage id="documents.legal-documents" />
        </SectionHeader>

        <Row>
          <Col xs={12} className={styles.groupName}>
            GENERATED DOCUMENTS
          </Col>
          {[documents[1]].map(({ title, url }) => <GeneratedDocuments {...{ title, url }} />)}
        </Row>

        <Row>
          <Col xs={12} className={styles.groupName}>
            APPROVED PROSPECTUS AND AGREEMENTS TO UPLOAD
          </Col>
          {[...documents, documents[0]].map(({ title, url }) => (
            <Col xs={6} md={3} key={url} className="mb-4">
              <DocumentTile title={title} extension={url} blank={url === "" ? true : false} />
              {/* TODO: Add correct condition for when a file is empty */}
            </Col>
          ))}
        </Row>
      </Col>
      <Col xs={12} md={3}>
        <SectionHeader className="my-4" layoutHasDecorator={false} />

        <Row>
          <SingleColDocumentsWidget groups={documentsData} className={styles.documents} />
        </Row>
      </Col>
    </Row>
  </LayoutAuthorized>
);
