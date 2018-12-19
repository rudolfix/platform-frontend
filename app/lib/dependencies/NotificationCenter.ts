import { injectable } from "inversify";
import { showErrorToast, showInfoToast } from "../../components/shared/Toast";

import {TMessage} from "../../components/translatedMessages/utils";
import {getMessageTranslation} from "../../components/translatedMessages/messages";

@injectable()
export class NotificationCenter {
  public error(message: TMessage): void {
    showErrorToast(getMessageTranslation(message));
  }
  public info(message: TMessage): void {
    showInfoToast(getMessageTranslation(message));
  }
}
