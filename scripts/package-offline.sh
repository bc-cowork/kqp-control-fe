#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${ROOT_DIR}/artifacts"
TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
PACKAGE_NAME="kqp-control-fe-offline-${TIMESTAMP}.tar.gz"
STAGING_DIR="${OUTPUT_DIR}/staging"

mkdir -p "${OUTPUT_DIR}"
rm -rf "${STAGING_DIR}"
mkdir -p "${STAGING_DIR}"

echo "Preparing offline package workspace at ${STAGING_DIR}" >&2

rsync -a \
  --exclude ".git" \
  --exclude ".github" \
  --exclude "artifacts" \
  --exclude "deploy_key" \
  --exclude "*.log" \
  --exclude "node_modules/.cache" \
  --exclude "tmp" \
  "${ROOT_DIR}/" "${STAGING_DIR}/"

tar -czf "${OUTPUT_DIR}/${PACKAGE_NAME}" -C "${STAGING_DIR}" .
sha256sum "${OUTPUT_DIR}/${PACKAGE_NAME}" > "${OUTPUT_DIR}/${PACKAGE_NAME}.sha256"

echo "Offline package created: ${OUTPUT_DIR}/${PACKAGE_NAME}" >&2
echo "Checksum written to: ${OUTPUT_DIR}/${PACKAGE_NAME}.sha256" >&2
