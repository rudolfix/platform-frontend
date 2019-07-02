import * as React from "react";
import * as sanitizeHtml from "sanitize-html";

import { CommonHtmlProps } from "../../types";

/**
 * This options should be in sync with rich text editor
 * Any modification should be taking with care to not end with security vulnerabilities
 */
export const SANITIZER_OPTIONS = {
  allowedTags: ["h2", "h3", "h4", "strong", "i", "a", "ul", "ol", "li", "p"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["https"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
  },
};

type TSanitizedHtml = { unsafeHtml: string };

export const SanitizedHtml: React.FunctionComponent<TSanitizedHtml & CommonHtmlProps> = ({
  unsafeHtml,
  className,
}) => (
  <div
    className={className}
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(unsafeHtml, SANITIZER_OPTIONS) }}
  />
);
