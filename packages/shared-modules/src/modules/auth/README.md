# Auth module

Manages all common authentication/authorization related logic. Stores the jwt token and user
information in the store. Refreshes JWT token when when it's close to expire.

### API

Exposes `authJsonHttpClient` and `authBinaryHttpClient` as symbols to make authorized http calls.

Exposes utility sagas to handle lifetime of a JWT token (`loadJwt`, `createJwt`, `setJwt`,
`escalateJwt`)

Allows getting access to the underline jwt token with `selectJwt` selector.

Module consumer should handle these effects to work properly:

- `authModuleAPI.actions.jwtTimeout` - dispatched when JWT token timeouts and app needs to clear and
  logout user state.

- `authModuleAPI.sagas.resetUser` - should be called by consumer during logout so auth module can
  properly cleanup state and stop watchers.

### Tech notes

Any kind of changes in the auth module requires intensive testing on both web and mobile app side to
be sure we do not introduce regression testing bugs.
