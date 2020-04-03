import {
  baseGray,
  baseWhite,
  blueyGrey,
  baseIron,
  baseSilver,
  baseYellow,
  baseGreen,
  baseRed,
  yellowDarker1,
  grayLighter1,
  grayLighter2,
  grayLighter4,
  baseOrange,
  silverLighter1,
  silverLighter2,
} from "../../styles/colors";
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
  },
  accent: {
    yellowDarker: yellowDarker1,
    grayLighter: grayLighter1,
    grayLighter2: grayLighter2,
    grayLighter4: grayLighter4,
    silverLighter: silverLighter1,
    silverLighter2: silverLighter2,
    blueGray: blueyGrey,
  },
};

export { lightColorSystem };
