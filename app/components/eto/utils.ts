import { cloneDeep, get, set } from "lodash";

import { TPartialEtoSpecData } from "../../lib/api/eto/EtoApi.interfaces";

export interface ICompoundField {
  [x: string]: string | number | undefined;
}

//removes data left from empty key-value fields, e.g. {key:undefined,value:undefined}
export const sanitizeKeyValueCompoundField = (data: ICompoundField[] | undefined) => {
  if (data !== undefined && data !== null) {
    const cleanData = data.filter(compoundField => {
      const keys = Object.keys(compoundField);
      return compoundField[keys[0]] !== undefined && compoundField[keys[1]] !== undefined;
    });
    return cleanData.length ? cleanData : undefined;
  } else {
    return undefined;
  }
};

//TODO this is very primitive for now. First we need determine how/where to store defaults
export const applyDefaults = (data: any, defaults: any) => {
  const dataCopy = { ...data };

  return Object.keys(defaults).reduce((acc, key) => {
    if (acc[key] === undefined || acc[key] === null) {
      acc[key] = defaults[key];
    }
    return acc;
  }, dataCopy);
};

export const convert = (data: TPartialEtoSpecData, convertion: any) => {
  if (data) {
    const dataCopy = cloneDeep(data);
    Object.keys(convertion).forEach(key => {
      const fieldValue = get(dataCopy, key);
      set(dataCopy, key, convertField(fieldValue, convertion[key]));
    });
    return dataCopy;
  } else {
    return data;
  }
};

const convertField = (input: any, f: any) => {
  return input !== undefined && input !== null ? f(input) : input;
};

export const convertPercentageToFraction = (data: number) => {
  return parseFloat((data / 100).toPrecision(4));
};

export const convertFractionToPercentage = (data: number) => {
  return parseFloat((data * 100).toFixed(2));
};

export const parseStringToFloat = (data: string | number) => {
  if (typeof data === "string") {
    const result = parseFloat(data);
    return Number.isNaN(result) ? undefined : result;
  } else {
    return data;
  }
};

export const convertToPrecision = (data: number, precision: number) => {
  if (data && !Number.isNaN(data)) {
    return parseFloat(
      data.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision,
      }),
    );
  } else {
    return undefined;
  }
};
