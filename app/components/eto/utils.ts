export interface ICompoundField {
  [x: string]: string | number | undefined;
}

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
