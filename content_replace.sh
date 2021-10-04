#!/bin/bash

# ヘルプ表示
function help() {
cat <<EOT
Usage:
    $0 [--param=(archives)]
Description:
    Replace  content parameters
Options:
    --param  target parameter
EOT
}

PARAM_VAL=''
REPLACE_DIR='./content/article'
ARCHIVES_FORMAT="+[\"%Y年%-m月\"]"
ARCHIVES_FROM='date'

# オプション引数受け取り
while getopts :-: opt; do

    # OPTARG を = の位置で分割して opt と optarg に代入
    optarg="$OPTARG"
    [[ "$opt" = - ]] &&
        opt="-${OPTARG%%=*}" &&
        optarg="${OPTARG/${OPTARG%%=*}/}" &&
        optarg="${optarg#=}"

    case "-$opt" in
        --param)
            PARAM_VAL="$optarg"
            ;;
        -h|--help)
            help
            exit 0
            ;;
    esac
done


if [ "$PARAM_VAL" = "archives" ]; then
    read -p "実行前にcontentをcommitしてください。進めてよろしいですか？  (y/n) :" YN
    if [ "${YN}" != "y" ]; then
        exit 1;
    fi

    files=`find "$REPLACE_DIR" -type f -name "*.md"`
    for file in $files; do
        echo $file
        front_matter=`awk 'BEGIN { RS="---\n"; FS="\n" } NR == 2 { print $0 }' ${file}`
        dt=`echo "${front_matter}" | awk -v from="${ARCHIVES_FROM}:" 'BEGIN { FS=" " } $1 == from { print $2 }'`
        archives=`date -j -f "%Y-%m-%dT%H:%M:%S+09:00" "${dt}" "${ARCHIVES_FORMAT}"`
        content=$(
            awk -v param="${PARAM_VAL}: " -v archives="${archives}" '
                BEGIN { RS="---\n"; FS="\n"; ORS=""; OFS=""; }
                {
                    if (NR == 1) {
                    } else if (NR == 2) {
                        print "---", "\n"
                        has_archive=0
                        for (i=1; i<NF; i++) {
                            if (match($i, param) >= 1) {
                                has_archive=1
                                print param, archives, "\n"
                            } else {
                                print $i, "\n"
                            }
                        }
                        if (has_archive == 0) {
                            print param, archives, "\n"
                        }
                    } else {
                        print "---", "\n"
                        print $0, "\n"
                    }
                }
            ' ${file}
        )
        echo "$content" > $file
    done
else
    echo "See --help option."
fi
