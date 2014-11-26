Living Wage Story
===================

This is the code for the site [Under a Living Wage](http://livingwagestory.code4sa.org/)

To do a once-off asset compilation:
```
./compile_assets
```

To compile assets automagically while working on them:
```
node less-watch-compiler.js public/fred/ public/css
```

To encode video down to the right size and format:
```
fmpeg -i input.m4v -b:v 512k -s 640x360 -crf 28 -preset veryslow output.mp4
```
