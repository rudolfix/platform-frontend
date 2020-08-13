import { CommonHtmlProps } from "@neufund/design-system";
import { XOR } from "@neufund/shared-utils";
import cn from "classnames";
import { isString } from "lodash";
import * as React from "react";
import { ListGroupItem } from "reactstrap";

import { TDataTestId } from "../../../../types";
import { CopyToClipboardButton } from "../../../shared/CopyToClipboardButton";

import * as styles from "./InfoRow.module.scss";

type TInfoRowCommonProps = {
  caption: React.ReactNode;
  clipboardCopyValue?: string;
};

type TInfoRowCopyProps =
  | XOR<
      { allowClipboardCopy: true; value: string },
      { allowClipboardCopy?: false; value: React.ReactNode }
    >
  | XOR<
      { allowClipboardCopy: true; value: string; clipboardCopyValue?: string },
      { allowClipboardCopy: true; value: React.ReactNode; clipboardCopyValue: string }
    >;

const selectCopyValue = (
  value: string | React.ReactNode,
  clipboardCopyValue: string | undefined,
) => {
  if (clipboardCopyValue) {
    return clipboardCopyValue;
  }

  if (isString(value)) {
    return value;
  }

  throw new Error("Value should be string or clipboardCopyValue should be set");
};

export const InfoRow: React.FunctionComponent<TInfoRowCommonProps &
  TInfoRowCopyProps &
  CommonHtmlProps &
  TDataTestId> = ({
  caption,
  value,
  allowClipboardCopy,
  "data-test-id": dataTestId,
  clipboardCopyValue,
  className,
}) => (
  <ListGroupItem className={cn(styles.infoRow, className)}>
    <div className={styles.infoCell}>{caption}</div>
    <div className={styles.infoCell}>
      <span data-test-id={dataTestId}>{value}</span>
      {allowClipboardCopy && (
        <CopyToClipboardButton
          className="ml-2"
          value={selectCopyValue(value, clipboardCopyValue)}
        />
      )}
    </div>
  </ListGroupItem>
);
