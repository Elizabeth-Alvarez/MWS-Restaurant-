#### Elizabeth comments

Stage 02 - Udacity Instructions:

- Fork and clone the server repository. You’ll use this development server to develop your project code.
- Change the data source for your restaurant requests to pull JSON from the server, parse the response and use the response to generate the site UI.
- Cache the JSON responses for offline use by using the IndexedDB API.
- Follow the recommendations provided by Lighthouse to achieve the required performance targets.


I used the following two resources to really understand how to use the IndexedDB API with promises. Went through the lab step by step to ensure I can perform the basic CRUD functions in the database.

Working with IndexedDB
https://developers.google.com/web/ilt/pwa/working-with-indexeddb#working_with_data

Lab: IndexedDB
https://developers.google.com/web/ilt/pwa/lab-indexeddb


I also used the following webinar as a guidance to how I should approach this project.  

Doug Brown [Project Coach]
https://www.youtube.com/watch?v=Q2CJYf_XA58&feature=youtu.be


Other Resources:

The Wed App Manifest
https://developers.google.com/web/fundamentals/web-app-manifest/

jakearchibald/idb
https://github.com/jakearchibald/idb

Lazy Loading Images and Video
https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/

aFarkas/lazysizes
https://github.com/aFarkas/lazysizes

Google Chrome DevTools  

Slack Channel students



-------------------------------------------------------------------------------------------------------------
STAGE 01

The main issue I had with this project was the service worker. After looking at tutorial after tutorial, the
following is what helped me reach ultimate success:

This lovely lady @bitsofcode had a great youtube video which I followed closely for the fetch request:
https://www.youtube.com/watch?v=BfL3pprhnms

The active request was constructed by the demo videos on the course.

Couple of resources I heavily relied on:
https://developers.google.com/web/fundamentals/codelabs/offline/
https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/

And of course, the use of my slack peeps :)

# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

### Specification

You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality.

### What do I do from here?

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.
3. Explore the provided code, and make start making a plan to implement the required features in three areas: responsive design, accessibility and offline use.
4. Write code to implement the updates to get this site on its way to being a mobile-ready website.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write.
