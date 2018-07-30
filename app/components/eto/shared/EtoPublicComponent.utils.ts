export const selectActiveCarouselTab = (elements: any[]): number => {
  for (let element in elements) {
    const el = elements[parseInt(element, 10)];

    if (el.members && el.members.length > 0 && el.members[0].name.length) {
      return parseInt(element, 10);
    }
  }

  return 0;
};
