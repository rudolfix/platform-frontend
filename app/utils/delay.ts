/**
 * Prefer this function than lodash's delay since mocking time doesn't work correctly there
 * @param time
 */
export function delay(time: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
