---
layout: ebook-page.html.ejs
title: Example fixed layout for an EPUB reading experience
bookHomeURL: '/toc.html'
---

The chosen experience for EPUB reading on-line is to make the content completely fill the browser viewport, to have a "book masthead" at the top of the window, immediately below that a row with a dropdown menu listing chapters and a running view of the current chapter, with the book content immediately below that.  The masthead and navigation row is to remain fixed at the top of the screen while the content is scrollable.  Optionally there is room at the top of the window for a site-wide navigation bar, and room at the bottom for .. uh, administrivia links, or advertising.

The old technique for a fixed layout like this is using absolute CSS positioning.  In `layouts-web-fixed` create a file named `ebook-page.html.ejs`.

```
<!doctype html>
<html class="ebook-page ebook-page-fixed" lang="en">
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
<body class="ebook-page ebook-page-fixed">

<partial file-name="site-navbar.html"></partial>

<ebook-page-header id="ebook-masthead" header-height="60px"></ebook-page-header>
<ebook-navigation-header id="ebook-navigation"></ebook-navigation-header>
<div id="book-page-content" class="panel-body"><%- content %></div>
<footer id="footer-row" class="container">
<partial file-name="footer.html.ejs"></partial>
</footer>

<ak-footerJavaScript></ak-footerJavaScript>
<partial file-name="google-analytics.html"></partial>

</body>
</html>
```

The tags in the `<head>` section are provided by AkashaCMS plugins and simplify construction of a complete metadata section.

Adding descriptive classnames helps with writing CSS rules that target pages made with this specific layout template.
The main page content uses a pair of Mahafunc's, `<ebook-page-header>` (the masthead) and `<ebook-navigation-header>` (the navigation bar), provided by the plugin containing this plugin.

In other words, we have some semantic markup that gives us a few boxes to lay out on the page.  Which, of course, requires appropriate CSS code.

## Fixed layout CSS

In `assets-web/css/style.css` put the following:

```
.ebook-page-flex, .ebook-page-fixed {
    height:100%;
    max-height:100%;
    margin:0;
}
```

This section is common to both the flexbox-based and fixed layout's.  The class names are used on both the `<html>` and `<body>` tags, and therefore this says the page body has a maximum height of 100% and therefore will not expand past the browser viewport.

Now let's look at the CSS rules to implement a fixed layout.

```

/* Using fixed layout techniques */

.ebook-page-fixed #ebook-masthead {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
    width: 100%;
}

.ebook-page-fixed #ebook-masthead h2 {
    font-size: 22px;
    margin-top: 0px;
}

.ebook-page-fixed #ebook-navigation {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 120px;
    height: 60px;
    width: 100%;
}

.ebook-page-fixed #book-page-content {
    position: absolute;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 50px;
    width: 100%;
    overflow: auto;
}

.ebook-page-fixed #footer-row {
    position: absolute;
    height: 50px;
    left: 0;
    right: 0;
    bottom: 0;
}

```

Each of these declarations target the `.ebook-page-fixed` meaning it applies only to pages using this layout template.

If you follow along you'll see it positions every element absolutely, giving enough room for the typical content of each.

This of course has a glaring responsiveness problem.  Does it degrade well to a small screen?  What if the text overflows the expected size?  
