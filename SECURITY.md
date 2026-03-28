# Security Policy

## Supported versions

- Latest published major/minor version is supported.

## Reporting a vulnerability

Please do not open public issues for security vulnerabilities.

Report privately to repository maintainers with:

- clear reproduction steps
- impacted versions
- severity assessment
- suggested mitigation (if available)

## Secrets handling

- Never commit real credentials in templates.
- Use local environment variables and private local config for secrets.
- Run secret scanning before release.
