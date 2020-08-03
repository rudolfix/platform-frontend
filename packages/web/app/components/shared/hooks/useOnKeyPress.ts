import * as React from "react";

const useOnKeyPress = (key: number, fn: Function) => (e: React.KeyboardEvent) => {
  if (e.which === key) {
    fn();
  }
};

/*
 * custom hook to run a function on <Enter> key press.
 *
 * @example:
 * in a list of items, open a modal with item details either on mouse click
 * or (moving focus with <tab> within the list) on <Enter> keypress
 *
 * const ListWithDetails:React.FunctionComponent = () => {
 *
 *   const onEnter = useOnEnterKeyPress(()=>showModal(itemId))
 *
 *   return (<li>
 *     <ul onKeyDown={useOnEnterKeyPress(()=>showModal(1))} onClick={()=>showModal(1)} tabIndex={0}>list item 1</ul>
 *     <ul onKeyDown={useOnEnterKeyPress(()=>showModal(2))} onClick={()=>showModal(2)} tabIndex={0}>list item 2</ul>
 *     <ul onKeyDown={useOnEnterKeyPress(()=>showModal(3))} onClick={()=>showModal(3)} tabIndex={0}>list item 3</ul>
 *   </li>)
 * }
 * */

export const useOnEnterKeyPress = (fn: Function) => useOnKeyPress(13, fn);
