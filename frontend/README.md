# frontend

React 19 + TypeScript + Vite 8 + Tailwind CSS 4, linted with ESLint and formatted with Prettier.

This folder is self-contained: the pnpm workspace, the Docker dev workspace, the toolchain and the
app all live here. **Do not run pnpm, Node or Vite on the host.**

## Run the dev server

```bash
# from this folder
cd /mnt/d/DEEPSEEK-AGENT-PROJECTS/aster-ik/frontend
docker compose up -d --build      # http://localhost:5273
docker compose down               # stop
docker compose logs -f frontend   # Vite + HMR output
```

Host port 5273 is published because 5173 is used by another project on this machine; inside the
container Vite always listens on 5173. Override with `FRONTEND_PORT=5274 docker compose up -d`.

## Checks (inside the container, never on the host)

```bash
docker compose run --rm frontend sh -lc 'pnpm install --frozen-lockfile && pnpm lint'
docker compose run --rm frontend sh -lc 'pnpm install --frozen-lockfile && pnpm typecheck'
docker compose run --rm frontend sh -lc 'pnpm install --frozen-lockfile && pnpm build'
docker compose run --rm frontend sh -lc 'pnpm install --frozen-lockfile && pnpm format:check'
```

## Layout

| Path                  | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `compose.yaml`        | Docker dev workspace: the only way to run anything          |
| `Dockerfile`          | Node 22 by digest + pnpm 12.16.1, no source, toolchain only |
| `package.json`        | The workspace root package; all scripts start here          |
| `pnpm-workspace.yaml` | Declares this folder as the pnpm workspace root             |
| `src/`                | App source                                                  |

## Why a container

- No Node/npm/pnpm on the Windows host; the toolchain is pinned in `Dockerfile`.
- Dependencies and the pnpm store live in a named volume, so the slow `/mnt/d` bind mount never
  sees `node_modules`.
- File watching uses polling, because inotify events from a Windows bind mount are unreliable.
