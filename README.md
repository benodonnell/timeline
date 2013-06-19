Movement Timeline is a free bit of software that makes it simple to display timelines in a horizontal format. See http://thirdolive.com/timeline for an example.

Instructions
============

Installing Movement Timeline is pretty easy if you're familiar with the basics of html and css.

1. Get the code
===============

Download the source code. Don't worry, it's free. You can get it at github.com/benodonnell/timeline or download it as a .zip from "thirdolive.com/timeline/MovementTimeline Source.zip".

2. Create a spreadsheet of your data
====================================

Look at the sample file called "Timeline Example Data.ods" to see how the data should be structured. Then clear out the sample data and enter your own timeline data.

3. Export the spreadsheet data to a cvs file
============================================

Export the spreadsheet data to .csv format and name the file "TimelineData.csv".

4. Upload the files to your web server
======================================

Upload the files inside the "js" directory in the source folder to the "js" directory on your web server. (Create a "js" directory if it doesn't already exist.) There should be 2 files in there: jquery.csv-0.71.min.js, and timeline.js.

Upload the css file called "timeline.css" inside the "styles" directory to the "styles" directory on your web server. Create a "styles" directory if it doesn't already exist.

Upload the TimelineData.csv file that you created in step 3 to the same directory on your web server as the html page that it will go into.

Please note that these directories should all exist within the same directory that contains the page on which you wish to place the timeline. In practice these files can be placed anywhere on your server, but if you place them in other places than described above, you'll have to change the code in step 5 a bit. Make sure you know what you're doing.

5. Edit your web page to include the code
=========================================

Edit the html file of the page that you want to place Movement Timeline on. First, place this code on the page where you want the timeline to go:

	<div id="timeline">&nbsp;</div>

Next, add the following code inside the <head> tag of your html document:

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script type="text/javascript" src="./js/jquery.csv-0.71.min.js"></script>
	<script type="text/javascript" src="./js/timeline.js"></script>
	<link rel="stylesheet" type="text/css" href="./styles/timeline.css" />

Finally, update your web server to contain this edited version of the html file and reload the page. Your timeline should appear.

Updating the Timeline
=====================

Once the timeline is installed, updating it is simple. Add and update as much information in the spreadsheet as you like. Then, export the entire spreadsheet to TimelineData.csv once again, and upload the new TimelineData file to your web server, overwriting the old one. Reload the web page and it will automatically load the new data from the file.

Feel free to contact ben at thirdolive dot com if you have a question, or if you'd like to hire me to develop the code further for you.