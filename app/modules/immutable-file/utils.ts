import {saveAs} from "file-saver";
import {TMessage} from "../../components/translatedMessages/utils";
import {TGlobalDependencies} from "../../di/setupBindings";
import {getMessageTranslation} from "../../components/translatedMessages/messages";

export function downloadLink(
  {intlWrapper:{intl:{formatIntlMessage}}}: TGlobalDependencies,
  blob: Blob,
  name: TMessage | string,
  fileExtension: string,
): void {
  const resolvedName = typeof name === 'string' ? name : getMessageTranslation(name); //FIXME
  //see https://github.com/yahoo/react-intl/issues/1051
  saveAs(blob, resolvedName + fileExtension);
}
