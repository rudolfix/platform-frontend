/**
 * action creators
 */
export const createAction = <T extends string, P extends {}>(type: T, payload: P) => {
  return { type, payload };
};

export const createSimpleAction = <T extends string>(type: T) => {
  return { type };
};
