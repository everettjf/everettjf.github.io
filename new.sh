articletitle=$1

if [ -z $articletitle ];then
  echo "usage: sh new.sh <article-title>"
  exit
fi

rake post title="$articletitle"
