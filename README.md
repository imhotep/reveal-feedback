reveal-feedback
===============

This is a set of applications that allow you to get immediate feedback when doing a presentation with [reveal.js](https://github.com/hakimel/reveal.js). People in your audience can use the *reveal-feedback-app* to vote up/like your slides. The charted results will be displayed in *reveal-feedback-stats*.

You can package *reveal-feedback-app* as a mobile app with [PhoneGap](http://www.phonegap.com) by just copying the assets to your www folder.

Setup
=====

In order to use the feedback app you need to setup a few things

1) A [couchdb](http://couchdb.apache.org) server (I use an [Amazon EC2](http://aws.amazon.com/ec2/) instance)

Create a new database, give it a name (such as *keynote*) and add this document:

    {
        id: "current",
        slide_id: null
    }

This document will be used to determine which slide is current so that people can vote it up.

create a new design document and call it _\_design/presentation_ . Create a new view and call it _all\_docs_ and add this code to it

    function(doc) {
      if(doc._id != "current") {
        emit(null, doc);
      }
    }

This view allows the stats app to generate its chart

create another view and call it *docs\_by\_indices* and add this code to it:

    function(doc) {
      if(doc.indexh != undefined && doc.indexv != undefined) {
        var key = doc.indexh + '-' + doc.indexv;
        emit(key, doc);
      }
    }

This allows reveal.js to create a new slide document if it does not exist or update the current slide with the right ID if the slide exists. 

Once you have all of that setup, you need to work on your presentation with [reveal.js](https://github.com/hakimel/reveal.js) :-) 
When you're done with with that, you need to include the reveal-feedback.js at the bottom of your [reveal.js](https://github.com/hakimel/reveal.js) presentation and scroll through your presentation (vertically and/or horizontally). That will update the couchdb database with all of your slides. Make sure to specify your host at the very top of the *reveal-feedback.js* file. You can keep adding slides but if you plan on deleting some slides it might be better to start with a clean database.

reveal-feedback-app
===================

This is a simple webapp that allows people to vote up a given slide while you're doing your presentation. The app fetches the current slide and whenever the user touches/clicks the `Like` button the couchdb database gets updated and the statistics get immediately updated too.

Make sure to include your couchdb database path at the top of the reveal-feedback-app.js file

reveal-feedback-stats
=====================

This is another very simple webapp that displays a chart with the vote data from the couchdb database. When you're done with your presentation you can show the charted results to your users. You'll get a sense of the most popular slides. You can also keep them to yourself as a valuable feedback so that you can keep working on the slides that were less popular or remove them all together.

Hosting
=======

I like to host all these web applications on the same server because they're very light client-side apps. I use [nginx](http://nginx.org).
You could use **proxy_pass** if you don't want to deal with couchdb's default port (5984). A firewall rule might prevent you from using a port different than 80/443 OR you might not want to open that port on your server.

    upstream couchdb {
            server localhost:5984;
    }

    server {

        location /keynote2 {
                proxy_pass http://couchdb;
        }

    }
