# Micro Templating Lib

It can:
- Insert strings into an element or as attributes.
- Nested referencing, as in `data-template-part="media.image.small"`.
- Basic loops of arrays of objects.

## Insert something
``` HTML
<h1 data-template-part="title"></h1>
```

## Insert Attribute
### JS
```JS
var data = {
  items: [
    {title: 'a title'},
    {title: 'another title'},
  ],
};

micro.inject($el, data);
```

### HTML
``` HTML
<ul>
  <li data-repeat="items">
    <span data-template-part="title"></span>
  </li>
</ul>
```
