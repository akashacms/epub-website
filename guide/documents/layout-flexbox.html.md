---
layout: ebook-page.html.ejs
title: Example flexbox-based layout for an EPUB reading experience
bookHomeURL: '/toc.html'
---

Now that we've looked at the old-school approach, using absolute positioning, let's look at the new-school, flexbox.  Flexbox CSS is a new layout paradigm using flexible boxes that have growing/shrinking/etc behavior instructions in CSS.  The general concept dates back over twenty years, coming from GUI layout strategies in several GUI toolkits.  

In `layouts-web-flex` add a file named `ebook-page.html.ejs`.

```
<!doctype html>
<html class="ebook-page ebook-page-flex" lang="en">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width" />

<ak-page-title></ak-page-title>
<ak-header-metatags></ak-header-metatags>
<ak-sitemapxml></ak-sitemapxml>
<ak-siteverification></ak-siteverification>
<ak-header-linkreltags></ak-header-linkreltags>
<ak-stylesheets></ak-stylesheets>
<ak-headerJavaScript></ak-headerJavaScript>

</head>
<body class="ebook-page ebook-page-flex">

<div id="page-container">
    <div id="site-navbar"><p>Site Navbar </p><partial file-name="site-navbar.html"></partial></div>
    <ebook-page-header id="ebook-masthead" header-height="60px"></ebook-page-header>
    <ebook-navigation-header id="ebook-navigation"></ebook-navigation-header>
    <div id="book-page-content" class="panel-body"><%- content %></div>
    <footer id="footer-row" class="container">
    <partial file-name="footer.html.ejs"></partial>
    </footer>
</div>

<ak-footerJavaScript></ak-footerJavaScript>
<partial file-name="google-analytics.html"></partial>

</body>
</html>
```

There's a lot of similarity between this page layout and the fixed layout shown previously.  The key difference is the `div` named `#page-container`.  We'll use this as the parent of the flexbox configuration.

## Flexbox layout for EPUB reading

As before it's the CSS that makes this work.  Add the following to `assets-web/css/style.css`.

```
/* Using flexbox layout techniques */

.ebook-page-flex #page-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}

.ebook-page-flex #site-navbar {
    flex-shrink: 0;
    height: 30px;
}

.ebook-page-flex #ebook-masthead {
    flex-shrink: 0;
    height: 60px;
}

.ebook-page-flex #ebook-masthead h2 {
    font-size: 22px;
    margin-top: 0px;
}

.ebook-page-flex #ebook-navigation {
    flex-shrink: 0;
    height: 60px;
}

.ebook-page-flex #book-page-content {
    flex-grow: 1;
    overflow: auto;
    min-height: 2em;
}

.ebook-page-flex #footer-row {
    flex-shrink: 0;
    height: 50px;
    background-color: grey;
}
```

The outer container, `#page-container`, declares this to flex as a `column`.  That is what we have, a vertical stack of boxes.

Most of the boxes are instructed to stay as a fixed height because we have specific things to put into them.  We may want the `#ebook-masthead` and `#ebook-navigation` boxes to grow so they'll accomodate longer book names or chapter names.  

The primary consideration is keeping enough room for `#book-page-content`.  This box is allowed to grow, and has a scrollbar.
