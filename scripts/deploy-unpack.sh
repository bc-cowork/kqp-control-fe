#!/usr/bin/env bash
set -euo pipefail

# 배포용 분할 압축 해제 스크립트
# deploy-pack.sh로 생성된 분할 파일을 병합하여 압축 해제합니다.

INPUT_DIR="${1:?사용법: $0 <분할파일_경로> [해제_경로]}"
OUTPUT_DIR="${2:-.}"

if [ ! -d "$INPUT_DIR" ]; then
  echo "오류: 경로를 찾을 수 없습니다: $INPUT_DIR"
  exit 1
fi

# 분할 파일 존재 확인
PART_FILES=$(ls "$INPUT_DIR"/*.tar.gz.part_* 2>/dev/null)
if [ -z "$PART_FILES" ]; then
  echo "오류: 분할 파일을 찾을 수 없습니다: $INPUT_DIR/*.tar.gz.part_*"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "=== 분할 압축 해제 시작 ==="
echo "입력 경로: $INPUT_DIR"
echo "해제 경로: $OUTPUT_DIR"
echo ""
echo "병합 대상 파일:"
ls -lh "$INPUT_DIR"/*.tar.gz.part_*
echo ""

cat "$INPUT_DIR"/*.tar.gz.part_* | tar xzf - -C "$OUTPUT_DIR"

echo "=== 압축 해제 완료 ==="
echo "해제 경로: $OUTPUT_DIR"
