git tag -a `grep -Po -m1 'v[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+' src/store/modules/about.ts` -m "auto tag by tag_it.sh"
