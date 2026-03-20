# Security Checklist

Use this checklist before publishing code or deploying.

## Secrets and credentials

- Keep .env files local only.
- Commit only placeholder values in docs and examples.
- Rotate any credential that was shared accidentally.
- Never expose production keys in client-side code.

## GitHub publication checks

- Run tests before publishing.
- Confirm no build artifacts are tracked.
- Confirm local databases are not tracked.
- Review staged changes with git diff --staged.

## Runtime hardening basics

- Set strong values for ADMIN_TOKEN and WOMPI_WEBHOOK_SECRET.
- Set NODE_ENV=production in deployment.
- Use APP_URL with the real public domain in production.
- Enable Upstash values if persistent rate limit is required.
