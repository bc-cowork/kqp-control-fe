#!/usr/bin/env bash
set -euo pipefail

# 배포용 분할 압축 스크립트
# 프로젝트 디렉터리를 지정 크기 이하로 분할 압축합니다.
# 사용법: deploy-pack.sh [출력경로] [분할크기(MB)]
# 제외 대상: CLAUDE.md, .git/, .github/, .gitignore, scripts/, .env.local, .claude/

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

OUTPUT_DIR="${1:-$(dirname "$PROJECT_DIR")/deploy-output}"
SPLIT_MB="${2:-99}"
SPLIT_SIZE="${SPLIT_MB}m"
TODAY="$(date +%d%m%y)"
FILE_PREFIX="${PROJECT_NAME}_${TODAY}.tar.gz.part_"

mkdir -p "$OUTPUT_DIR"

# 기존 분할 파일 정리
rm -f "$OUTPUT_DIR/${PROJECT_NAME}_"*.tar.gz.part_*

echo "=== 배포용 분할 압축 시작 ==="
echo "프로젝트: $PROJECT_DIR"
echo "출력 경로: $OUTPUT_DIR"
echo "분할 크기: ${SPLIT_MB}MB 이하"
echo ""

# tar 압축 + split 분할
tar czf - \
  -C "$(dirname "$PROJECT_DIR")" \
  --exclude="${PROJECT_NAME}/CLAUDE.md" \
  --exclude="${PROJECT_NAME}/.git" \
  --exclude="${PROJECT_NAME}/.github" \
  --exclude="${PROJECT_NAME}/.gitignore" \
  --exclude="${PROJECT_NAME}/scripts" \
  --exclude="${PROJECT_NAME}/.env.local" \
  --exclude="${PROJECT_NAME}/.claude" \
  --exclude="${PROJECT_NAME}/deploy-output" \
  "$PROJECT_NAME" \
  | split -b "$SPLIT_SIZE" -a 2 - "$OUTPUT_DIR/${FILE_PREFIX}"

# 분할 파일명을 aa, ab, ac ... 형식으로 유지 (split 기본값)
echo "=== 압축 완료 ==="
echo ""
echo "생성된 파일:"
ls -lh "$OUTPUT_DIR/${PROJECT_NAME}_${TODAY}.tar.gz.part_"*
echo ""
echo "총 파일 수: $(ls "$OUTPUT_DIR/${PROJECT_NAME}_${TODAY}.tar.gz.part_"* | wc -l)"
echo "총 크기: $(du -sh "$OUTPUT_DIR" | cut -f1)"
echo ""
echo "압축 해제: scripts/deploy-unpack.sh <분할파일_경로> <해제_경로>"
