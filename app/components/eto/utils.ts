export interface ICompoundField {
  [x: string]: string | number | undefined;
}

export const sanitizeKeyValueCompoundField = (data: ICompoundField[] | undefined) =>
  data &&
  data.filter(compoundField => {
    const keys = Object.keys(compoundField);
    return compoundField[keys[0]] !== undefined && compoundField[keys[1]] !== undefined;
  });
