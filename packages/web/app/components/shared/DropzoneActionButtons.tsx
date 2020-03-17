import { CircleButton, ECircleButtonLayout } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId } from "../../types";

import remove from "../../assets/img/inline_icons/delete.svg";
import download from "../../assets/img/inline_icons/download.svg";
import * as styles from "./Dropzone.module.scss";

interface IProps {
  className?: string;
  onDownload?: () => void;
  onRemove?: () => void;
  disableDownload?: boolean;
  disableRemove?: boolean;
}

const DropzoneActionButtons: React.FunctionComponent<IProps & TDataTestId> = ({
  className,
  onDownload,
  onRemove,
  "data-test-id": dataTestId,
  disableDownload,
  disableRemove,
}) => {
  const [confirmRemove, toggleConfirmRemove] = React.useState(false);

  return (
    <div className={className}>
      {onDownload && (
        <CircleButton
          className={styles.actionButton}
          layout={ECircleButtonLayout.SECONDARY}
          data-test-id={`${dataTestId}.download`}
          onClick={onDownload}
          svgIcon={download}
          iconProps={{
            alt: <FormattedMessage id="shared.dropzone.download.alt" />,
          }}
          disabled={disableDownload}
        />
      )}
      {onRemove && !disableRemove ? (
        confirmRemove ? (
          <CircleButton
            className={styles.actionButton}
            layout={ECircleButtonLayout.DANGER}
            data-test-id={`${dataTestId}.remove`}
            onClick={onRemove}
          >
            <FormattedMessage id="shared.dropzone.remove.confirm" />
          </CircleButton>
        ) : (
          <CircleButton
            className={styles.actionButton}
            layout={ECircleButtonLayout.SECONDARY}
            data-test-id={`${dataTestId}.remove-confirm`}
            onClick={() => toggleConfirmRemove(!confirmRemove)}
            svgIcon={remove}
            iconProps={{
              alt: <FormattedMessage id="shared.dropzone.remove.alt" />,
            }}
          />
        )
      ) : null}
    </div>
  );
};

export { DropzoneActionButtons };
