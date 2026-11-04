# syntax=docker/dockerfile:1

# Node 22 pinned by digest: Vite 8 needs ^20.19 || >=22.12.
ARG NODE_IMAGE=node:22-bookworm-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da

FROM ${NODE_IMAGE}

# pnpm is installed at build time, so no package manager is ever fetched at runtime.
ARG PNPM_VERSION=12.16.1
RUN npm install --global "pnpm@${PNPM_VERSION}" && pnpm --version

# The toolchain lives here; this folder is bind-mounted on top of /app by compose.yaml.
WORKDIR /app

# Development workspace: no source is copied into the image, so the container always
# runs the code from the mount, with dependencies resolved inside the volume.
EXPOSE 5173
CMD ["pnpm", "dev"]
