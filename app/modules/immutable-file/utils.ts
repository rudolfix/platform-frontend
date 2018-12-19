import {TGlobalDependencies} from "../../di/setupBindings";
import {saveAs} from "file-saver";
import {TMessage} from "../../components/translatedMessages/utils";
import {getMessageTranslation} from "../../components/translatedMessages/messages";

export function downloadLink(
  {intlWrapper:{intl:{formatIntlMessage}}}: TGlobalDependencies,
  blob: Blob,
  name: TMessage | string,
  fileExtension: string,
): void {
  const resolvedName = typeof name === 'string' ? name : formatIntlMessage(name); //FIXME
  saveAs(blob, formatIntlMessage(resolvedName) + fileExtension);
}
