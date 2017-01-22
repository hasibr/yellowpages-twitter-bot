console.log("Starting the twitter auto-reply bot!");

var Twit = require('twit');
var request = require('request');

var T = new Twit({
  consumer_key:         'auSfMF5ddlgo1CMOPgqEioZJJ',
  consumer_secret:      'kRTffq6oi7ifWQqzVd44Cl2w48xjVCtYYhpOmPCLJocpsmAss7',
  access_token:         '822870583805353986-bvel1wUsdTU0rp3rw8JUx5Z3o06sBEQ',
  access_token_secret:  'QLNjWSkISCgcqObzUdGdOvwDkYoV3xlb9ycBt7fr3FXbV',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

/* Set up user stream to establish a 'continuous' connection to Twitter and make requests to Twitter's API
   to search for #askYP tag. */
tagToSearch = '#askYP';
var stream = T.stream('statuses/filter', { track: tagToSearch, language: 'en' })
stream.on('tweet', onTweet);

/**
 * Callback function, occurs when user tweets containing specific tag. Sends
 * request to Yellow Pages API to search for the item and returns selective deals
 * and merchants.
 * @param {JSON} eventMsg 
 */
function onTweet(eventMsg) {
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;

	console.log('User ' + from + ' tweeted saying: ' + text + '; replying to them now');
	var item = parseRequest(text);
	var yp_api = 'http://hackaton.ypcloud.io/dcr/api/search/popular?keyword=';
	request(yp_api + item, function(error, response, body) {
		var results = JSON.parse(body);
		var result = '';

		var row;
		for (row = 0; row < results.data.length; ++row) {
			result += (row + 1) + ". " + results.data[row].result.Translation.en.title + ", ";
		//results.data[row].result.Translation.en.url
		}

		var reply_msg = '@' + from + ' ' + result;
		tweetIt(reply_msg.slice(0, 136) + "...");
	})
}

/**
 * Posts a tweet.
 * @param {String} text
 */
function tweetIt(text) {
	var tweet = {
		status: text
	}

	T.post('/statuses/update', tweet, tweeted);
	function tweeted(err, data, response) {
		if (err) {
			console.log("Something went wrong!");
		} else {
			console.log("Tweet sent successfully!");
		}
	}
}

/**
 * Parses a tweet to determine what the user is searching for.
 * @param {String} text
 * @return {String} item
 */
function parseRequest(text) {
	/* For now we'll just assume the tweet has to be in the format
	'I would like to buy Louis Vuitton Shoes #askYP'
	*/
	var item = text.replace(tagToSearch, '');
	item = text.substring((text.indexOf("buy ") + 4), (text.length - 1));
	return item;
}

/**
 * Uses Yellow Pages API to propose nearby merchants that are selling the item
 * @param {String} item
 */
 var file_system = require('fs');
 
function searchItem(item) {

}