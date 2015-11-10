var util = require('util');
var request = require('request');
var fs = require('fs');
var ig = require('instagram-node').instagram();


var IGCrawler = {

	igNextMinId: 0,

	/**
	 * Init.
	 */
	init: function() {

		var self = this;

		ig.use({ client_id: 'f3f45a44ade847789c3d1a0db9beb802',
				 client_secret: '155c4013a57a4c6f909243062fcd07a7' });

		// Load tweets.
		self.doIGSearch();


	},

	doIGSearch: function() {

		console.log("**************************** INSTAGRAM SEARCH **********************************");

		var self = this;
		ig.tag_media_recent('slush15', function(err, medias, pagination, remaining, limit) {

			if (medias) {

				self.igNextMinId = pagination.next_min_id;

				console.log("Found " + medias.length + " results");
				console.log("Next min id is: " + self.igNextMinId);

				for (i in medias) {


					try {

						// // Create simple object.
						// var tweet = {
						// 	type: "instagram",
						// 	text: typeof(medias[i].caption) != "undefined" && typeof(medias[i].caption.text) != "undefined" ? medias[i].caption.text : "",
						// 	id: medias[i].id,
						// 	user: medias[i].user.username,
						// 	retweet_count: 0,
						// 	favorite_count: medias[i].likes.count,
						// 	image: medias[i].images.standard_resolution.url
						// };
						//
						// // Add tweet to list.
						// if (self.addTweet(tweet)) {
						// 	console.log("Adding new instagram image from @" + tweet.user);
						// 	self.downloadImage(tweet.image, "img/" + tweet.image.replace(/.*\//, ""), function(){
						// 		console.log('Instagram image downloaded: ' + tweet.image);
						// 	});
						// }

						console.log(medias[i].images);

						self.downloadImage(medias[i].images.thumbnail.url, "../img/slush/thumb/" + i + ".jpg", function(){
							console.log('Instagram image downloaded: ' + medias[i].images.thumbnail.url);
						});

					} catch(e) {
						console.log("Couldn't add tweet:");
						console.log(e);
					}

				}

				// self.saveTweets();


			}
		});
	},

	downloadImage: function(uri, filename, callback) {
		request.head(uri, function(err, res, body) {
			console.log('content-type:', res.headers['content-type']);
			console.log('content-length:', res.headers['content-length']);
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	}

}
IGCrawler.init();
