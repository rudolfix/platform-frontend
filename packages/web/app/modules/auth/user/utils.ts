/**
 * Returns the new email value for the user body
 * @param verifiedEmail
 * @param email
 */
export const getUsersNewEmailValue = (
  verifiedEmail: string | undefined,
  email: string | undefined,
) => (verifiedEmail !== email ? email : undefined);
