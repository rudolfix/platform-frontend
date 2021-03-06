import { SingleOrArray } from "@neufund/shared-utils";
import flatMap from "lodash/flatMap";
import isObjectLike from "lodash/isObjectLike";
import { StyleProp } from "react-native";

type Style = StyleProp<unknown>;

type StyleOrArrayOfStyles = Style | [unknown, SingleOrArray<Style>];
/**
 * A helpful react-native style util to work with conditional styling
 *
 * @todo It should be possible to type it better in the future
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const st = (...styles: StyleOrArrayOfStyles[]): object[] =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  flatMap(styles, style => {
    // remember to check also if first item is of primitive type
    if (Array.isArray(style) && !isObjectLike(style[0])) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return style[0] ? style[1] : [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return style;
  });

export { st };
