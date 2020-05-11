import {
  baseGray,
  baseGreen,
  baseIron,
  baseOrange,
  baseRed,
  baseSilver,
  baseWhite,
  baseYellow,
  blueyGray,
  darkBlueGray1,
  darkBlueGray2,
  grayLighter1,
  grayLighter2,
  grayLighter4,
  silverLighter1,
  silverLighter2,
  yellowDarker1,
} from "styles/colors";
import { IColorSystem } from "../types";

const lightColorSystem: IColorSystem = {
  base: {
    yellow: baseYellow,
    orange: baseOrange,
    gray: baseGray,
    silver: baseSilver,
    iron: baseIron,
    white: baseWhite,
    green: baseGreen,
    red: baseRed,
    blueGray: blueyGray,
  },
  accent: {
    yellowDarker: yellowDarker1,
    grayLighter: grayLighter1,
    grayLighter2: grayLighter2,
    grayLighter4: grayLighter4,
    silverLighter: silverLighter1,
    silverLighter2: silverLighter2,
    blueGrayDarker: darkBlueGray1,
    blueGrayDarker2: darkBlueGray2,
  },
};

export { lightColorSystem };
