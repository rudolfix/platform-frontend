export const dontPropagateEvent = (handler: Function) => (e: Event) => {
  e.stopPropagation();
  handler(e);
};
