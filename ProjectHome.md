This is a simplified stub for object-fit behaviour, supporting
only 'cover' and 'contain' There is a more elaborate polyfill here

https://github.com/anselmh/object-fit

if you don't know what object-fit is, read

http://www.quirksmode.org/css/images/object.html

a 'cover' should size up min
100% height and width of its
parent called .objectfit-wrap


a contain should size up max
100% height and width of its
parent called .objectfit-wrap


> to fit an element, just call
```
                $(elm).cover() or
                $(elm).contain()
```
> for better performance, write the wrapper
> that should contain the element yourself
> in html and specify the sizes on the
> element that should be fit.

> eg
```
        <div class="objectfit-wrap">
                <video style="width:100px; height:100px"></video>
        ...
        $('video').cover();
```
There are a few options:

```
        options = {     
                fixed   : bool .. will write px instead of %
                loaded  : bool .. dont recurse if youre not loaded yet
                fit             : cover|contain
        }
```