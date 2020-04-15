# Auth module

Manages all common authentication/authorization related logic. Stores the jwt token and user
information in the store.

### API

Exposes `authJsonHttpClient` and `authBinaryHttpClient` as symbols to make authorized http calls.

Exposes utility sagas to handle lifetime of a JWT token (`loadJwt`, `createJwt`, `setJwt`,
`escalateJwt`, `refreshJWT`)

Allows to get access to the underline jwt token with `selectJwt` selector.

### Tech notes

Any kind of changes in the auth module requires intensive testing on both web and mobile app side to
be sure we do not introduce regression testing bugs.
