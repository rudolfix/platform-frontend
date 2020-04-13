/**
 * Returns the new email value for the user body
 * @param verifiedEmail
 * @param unverifiedEmail
 * @param email
 */
export const getUsersNewEmailValue = (
  verifiedEmail: string | undefined,
  unverifiedEmail: string | undefined,
  email: string | undefined,
) => (verifiedEmail !== email && unverifiedEmail !== email ? email : undefined);
