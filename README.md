# aster-ik

Monorepo for the aster-ik product.

```
aster-ik/
├── frontend/     React 19 + TypeScript + Vite 8 + Tailwind 4 — self-contained workspace
├── backend/      placeholder, owned by the backend engineer
└── .github/      CI
```

The frontend is a **self-contained** pnpm workspace: its `package.json`, `pnpm-workspace.yaml`,
lockfile, Dockerfile and compose file all live in `frontend/`. All tooling runs in the Docker dev
workspace — no Node, pnpm or Vite on the host. See [frontend/README.md](frontend/README.md).

## Branch strategy

`main` is the only long-lived branch. It is protected, always green, and always deployable.

| Rule | Value |
|------|-------|
| Direct pushes to `main` | not allowed — every change arrives through a PR |
| Branch naming | `<type>/<slug>`, type ∈ `feat`, `fix`, `chore`, `ci`, `docs`, `refactor` |
| Branch lifetime | short-lived; delete after merge |
| Required check | `verify` (CI must be green before merge) |
| Merge method | squash merge, one commit per PR |
| Force-push / branch deletion | disabled on `main` |
| Required reviews | 0 while the team is one person; raise to 1 when a second committer joins |

Examples: `feat/login-form`, `fix/dev-server-port`, `ci/preview-deploy`, `docs/branch-strategy`.

Commit subjects follow Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`, `docs:`), one
logical change per commit.

Release tags (`vX.Y.Z`) are cut from `main` at deploy time, never from a feature branch.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and every PR targeting `main`:

| Step | Command (in `frontend/`) |
|------|--------------------------|
| install | `pnpm install --frozen-lockfile` |
| lint | `pnpm lint` |
| typecheck | `pnpm typecheck` |
| build | `pnpm build` |
| format | `pnpm format:check` |
| artifact | `frontend/dist` uploaded as `frontend-dist` (7 days) |

The same commands run locally inside the container:

```bash
cd frontend
docker compose run --rm frontend sh -lc 'pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm build && pnpm format:check'
```

## Test deploy (GitHub Pages)

Every merge to `main` publishes the built app to GitHub Pages — no `gh-pages` branch, Pages is
fed directly from the Actions artifact:

- URL: https://mizuthethird-arch.github.io/aster-ik/
- Trigger: `push` to `main` only; pull requests build but never deploy
- Build base path: `VITE_BASE=/aster-ik/` (Pages serves the repo under a subpath)

Pull requests get no preview URL: GitHub Pages publishes one site per repository. Production will
be self-hosted later — GitHub Pages is the test surface only.

## Security

- No secrets in the repo. Runtime configuration goes through GitHub Actions secrets and
  environment variables, referenced by name only.
- `agents-brain/` is internal agent state and is gitignored — it is never published.
