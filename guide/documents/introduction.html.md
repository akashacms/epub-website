---
layout: ebook-page.html.ejs
title: Rendering eBook content as both EPUB and websites
bookHomeURL: '/toc.html'
---

Using AkashaRender and epubtools it's easily possible to build an EPUB.  This little guide-book you're reading is an example.  The AkashaRender toolchain allows you to write eBook content in Markdown, and render it to an EPUB for distribution using a simple process.  But what if you could take the same content and render it differently, such as a website?  

That is, both EPUB's and websites use HTML files.  There are small differences, but it's essentially the same technology.  Shouldn't we be able to target both website and EPUB delivery using the same content?

With AkashaRender we configure it for a given output.  When used to generate HTML for EPUB, it is configured for that purpose, and when used to generate website HTML, it is configured for that purpose.

Therefore, the goal of having eBook content rendered as either a website or EPUB is "simply" a matter of maintaining two parallel AkashaRender configurations.  The purpose of this guide is documenting that process.

Specifically this guide demonstrates-by-doing what to do.  The source code for this book is configured to be displayed either way, and it contains a few Mahafunc's and partials to assist.

The concept here is this question:  How does one translate the EPUB Reader experience to a website?  Isn't an EPUB rendered on a website still an EPUB?  If so, shouldn't it be read somewhat like a book?
