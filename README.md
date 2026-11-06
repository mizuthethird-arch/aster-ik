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

Two long-lived branches and one promotion path. Work always flows left to right:

```
<type>/<slug>  ──PR──▶  dev  ──PR──▶  main
   feature work        integration        production
```

| Branch | Role | Published to |
|--------|------|--------------|
| `main` | production. Only ever receives merges from `dev`. | self-hosted production (later) |
| `dev` | integration. Where feature PRs land; all features are tested together here. | GitHub Pages test site |
| `<type>/<slug>` | short-lived work, cut from `dev`, merged back into `dev`. | nothing |

Type ∈ `feat`, `fix`, `chore`, `ci`, `docs`, `refactor`; slug is kebab-case:
`feat/login-form`, `fix/dev-server-port`, `ci/pages-test-deploy`, `docs/branch-strategy`.

Rules — identical on `main` and `dev`:

| Rule | Value |
|------|-------|
| Direct pushes | not allowed on `main` or `dev` — every change arrives through a PR |
| PR base | feature → `dev`; promotion → `main` (from `dev` only) |
| Required check | `verify` (CI green before merge) |
| Merge method | squash merge, one commit per PR |
| Branch after merge | feature branches deleted after merge; `dev` is never deleted |
| Force-push / branch deletion | disabled on both protected branches |
| History | linear, conversation resolution required |
| Required reviews | 0 while the team is one person; raise to 1 when a second committer joins |

> Repository setting `delete_branch_on_merge` is **off** on purpose: the promotion PR's head is
> `dev`, so an automatic delete would destroy the integration branch. Feature branches are deleted
> explicitly when their PR is merged (`gh pr merge --squash --delete-branch`).

Promotion is a deliberate step, never a fast-forward: when `dev` is verified on the test site, open
a PR from `dev` into `main`, let `verify` run again, squash-merge, then tag `vX.Y.Z` from `main`.

A hotfix follows the same path — `fix/<slug>` → `dev` → `main`. Nothing skips the promotion PR.

Commit subjects follow Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`, `docs:`), one
logical change per commit.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and `dev`, and every PR targeting them:

| Step | Command (in `frontend/`) |
|------|--------------------------|
| install | `pnpm install --frozen-lockfile` |
| lint | `pnpm lint` |
| typecheck | `pnpm typecheck` |
| test | `pnpm test` (vitest) |
| build | `pnpm build` |
| format | `pnpm format:check` |
| artifact | `frontend/dist` uploaded as `frontend-dist` (7 days) |

All of these are inside the single required `verify` check, so **red tests block the merge** — a PR
cannot land on `dev` or `main` while any of them fails.

The same commands run locally inside the container:

```bash
cd frontend
docker compose run --rm frontend sh -lc 'pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm format:check'
```

## Test deploy (GitHub Pages)

Every merge to **`dev`** publishes the built app to GitHub Pages — no `gh-pages` branch, Pages is
fed directly from the Actions artifact:

- URL: https://mizuthethird-arch.github.io/aster-ik/
- Trigger: `push` to `dev` only; `main` and pull requests build but never deploy
- Build base path: `VITE_BASE=/aster-ik/` (Pages serves the repo under a subpath)
- The `github-pages` environment has a custom branch policy allowing only `main` and `dev`; any
  other branch that tries to deploy fails at the deploy step until it is added to that policy.

Pull requests get no preview URL: GitHub Pages publishes one site per repository. This site is the
integration test surface; it mirrors `dev`, not production.

## Security

- No secrets in the repo. Runtime configuration goes through GitHub Actions secrets and
  environment variables, referenced by name only.
- `agents-brain/` is internal agent state and is gitignored — it is never published.
