This folder contains a TestSprite configuration and example Playwright E2E test.

Files added:
- `testsprite.config.json` — placeholder TestSprite config (replace endpoint/api details as needed).
- `tests/e2e/home.spec.ts` — sample Playwright test that visits `http://localhost:3000`.
- `.github/workflows/testsprite.yml` — GitHub Actions workflow that runs Playwright tests and uploads results to TestSprite (uses `TESTSPRITE_API_KEY` secret).

Quick local setup

1. Install dev dependencies:

```bash
npm install -D @playwright/test
```

2. Add suggested npm scripts to your `package.json` (manually):

```json
"scripts": {
  "test:e2e": "npx playwright test --reporter=json > tests/results/playwright-results.json",
  "test:ci": "npm run test:e2e && npx testsprite upload --api-key \"$TESTSPRITE_API_KEY\" --file tests/results/playwright-results.json"
}
```

3. Run tests locally:

```bash
npx playwright install
npm run test:e2e
```

4. Upload results to TestSprite (replace with official CLI if available):

```bash
export TESTSPRITE_API_KEY="<your-key>"
npx testsprite upload --api-key "$TESTSPRITE_API_KEY" --file tests/results/playwright-results.json
```

Notes
- `testsprite.config.json` is a placeholder format — provide TestSprite docs or CLI details and I will update this file and the workflow to use the exact fields/commands required.
- If you want unit tests too, I can add `vitest` setup and a few sample unit tests.
