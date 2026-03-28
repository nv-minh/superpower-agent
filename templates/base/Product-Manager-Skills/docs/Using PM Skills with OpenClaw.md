# Using PM Skills with OpenClaw

OpenClaw is useful when you want an open, self-hosted assistant environment and controlled experimentation.

If this is your first time here, read [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md) first.

## Best For

- PMs and teams who want to test alternative agent behaviors
- Organizations that prefer self-hosted options
- Side-by-side quality comparisons against other AI tools

## 10-Minute Setup

1. Get OpenClaw running in your environment.
2. Make this repo accessible to OpenClaw (local mount or connected source).
3. Start with one skill path:

```text
Use skills/prioritization-advisor/SKILL.md to guide framework selection for our roadmap tradeoffs. Ask questions one at a time, then provide numbered recommendations.
```

## First Win Prompts

```text
Using skills/problem-framing-canvas/SKILL.md, help me frame our onboarding drop-off problem before proposing solutions.
```

```text
Run commands/discover.md for: reduce activation drop-off for self-serve SMB users.
```

## How To Keep Output Quality High

- Treat one skill as your operating system for a single conversation.
- Ask for assumptions and evidence gaps before recommendations.
- Keep an explicit decision log (what you accepted, rejected, and why).

## Common Pitfalls

- Running experiments without a success metric.
- Comparing tools with different prompts and calling results "better".
- Switching frameworks midstream without documenting the reason.

## Learn More (Official)

- OpenClaw docs: [https://docs.openclaw.ai/](https://docs.openclaw.ai/)
- OpenClaw security docs: [https://docs.openclaw.ai/security](https://docs.openclaw.ai/security)
- OpenClaw GitHub: [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
- OpenClaw site: [https://openclaw.ai/](https://openclaw.ai/)

## PM Skills Links

- Tooling charter context: [`PM Tooling Operations Charter.md`](PM%20Tooling%20Operations%20Charter.md)
- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
