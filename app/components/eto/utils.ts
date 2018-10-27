export const sanitizeKeyValueCompoundField = (data:any) => {
  const arr = data.reduce(
    (acc:any, compoundField:any) => {
      const keys = Object.keys(compoundField);
      if(compoundField[keys[0]] !== undefined && compoundField[keys[1]] !== undefined){
        acc.push(compoundField);
      }
      return acc
    }, []
  );
  return arr.length ? arr : undefined
};
