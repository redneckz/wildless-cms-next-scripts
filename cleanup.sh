#!/usr/bin/env sh
set -e

export TOKEN="${TOKEN:-}" # Env var

export BASE=gitlab.rshbdev.ru
export PROJECT=18993 # 18993 is /crft/ctp/portals/rshb-ru/natural
export N=100         # Count of old objects to delete
export TARGET=count  # tag/rel/pipe/count

while [ "$#" -gt 0 ]; do
  case "$1" in
  git* | *ru) BASE="$1" ;;
  -p | --project)
    shift
    PROJECT="$1"
    ;;
  -n)
    shift
    N="$1"
    ;;
  -c | --count) TARGET="count" ;;
  --tag*) TARGET="tag" ;;
  --rel*) TARGET="rel" ;;
  --pip*) TARGET="pipe" ;;
  *)
    echo "Invalid option $1" >&2
    exit 1
    ;;
  esac
  shift
done

get() {
  url=$(echo "$1" | xargs)
  shift
  curl "$@" -k4 --header "PRIVATE-TOKEN: $TOKEN" "https://$BASE/api/v4/projects/$PROJECT/$url"
}

delete() {
  url=$(echo "$1" | xargs)
  echo DELETE "https://$BASE/api/v4/projects/$PROJECT/$url"
  curl -k4 -X DELETE --header "PRIVATE-TOKEN: $TOKEN" "https://$BASE/api/v4/projects/$PROJECT/$url" >/dev/null
}

accept() {
  echo "Yes[y] or No[n]?"
  while read -r answer; do
    case "$answer" in
    [Yy]*) break ;;
    [Nn]*) exit ;;
    *) echo "Yes[y] or No[n]?" ;;
    esac
  done
}

case "$TARGET" in
tag)
  tags=$(get repository/tags?sort=asc\&per_page="$N" | jq -r '.[] | .name')
  echo Oldest tags:
  echo "$tags"
  echo You are going to cleanup "#$N" tags...
  accept
  echo "$tags" | while read -r tag; do delete repository/tags/"$tag"; done
  echo Success
  ;;
rel)
  releases=$(get releases?sort=asc\&per_page="$N" | jq -r '.[] | .tag_name')
  echo Oldest releases:
  echo "$releases"
  echo You are going to cleanup "#$N" releases...
  accept
  echo "$releases" | while read -r tag_name; do delete releases/"$tag_name"; done
  echo Success
  ;;
pipe)
  pipelines=$(get pipelines?order_by=updated_at\&sort=asc\&per_page="$N" | jq -r '.[] | .id')
  echo Oldest pipelines:
  echo "$pipelines"
  echo You are going to cleanup "#$N" pipelines...
  accept
  echo "$pipelines" | while read -r id; do delete pipelines/"$id"; done
  echo Success
  ;;
count)
  echo Tags:
  get repository/tags?per_page=1 -sI | grep x-total:
  echo Releases:
  get releases?per_page=1 -sI | grep x-total:
  echo Pipelines:
  get pipelines?per_page=1 -sI | grep x-total:
  ;;
*)
  echo "Invalid target $TARGET" >&2
  exit 1
  ;;
esac
