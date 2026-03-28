# API Conventions

- Use versioned route namespaces when public API is exposed.
- Validate request input at the boundary. Never trust client payload.
- Return stable response shapes with explicit error codes.
- Keep handlers thin. Move business logic to service/domain layer.
- Require requirement ID trace in API implementation task notes.

