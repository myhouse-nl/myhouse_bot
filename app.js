'use strict'
const http = require('http')
const Bot = require('messenger-bot')
const Wit = require('node-wit').Wit;
var globalMessage = {
        "text":"hello, world!"
    };
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);
    globalMessage.text = message;
    replyToBot();
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
};
const client = new Wit('PUKQECZWMTTV6XQLVFRCWJPVTXRGRIES', actions);
var fbid = '';

let bot = new Bot({
	token: 'EAADevcB27GwBAC84Pz1ZCG0q8Sm34DQNxQdpxz440Y4fZBQl0yd5ZCHsuiUV6uuzT0MH1iVWuYEIEonAuaaiZALZCuSOR5KBQGufVdyhZCvqmIDAfpc0ZCKsdAcxx2KzvIaiJTDuKZAXZCTY7pZBKVa3J4BZCIDyyBfFZBG4ZCxXHMtXWqgZDZD',
	verify: 'VERIFY_TOKEN'
})
bot.on('error', (err) => {
	console.log(err.message)
})
bot.on('message', (payload, reply) => {
	console.log('message received');
	fbid = payload.sender.id;
	console.log(fbid);
	let text = payload.message.text;
	var msg = payload.message.text;
	console.log(msg);
	var sessionId = findOrCreateSession(fbid);
	console.log('Runactions');
	client.runActions(
        sessionId, // the user's current session
        msg, // the user's message 
        sessions[sessionId].context, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            // Our bot did everything it has to do.
            // Now it's waiting for further messages to proceed.
            console.log('Waiting for futher messages.');

            // Based on the session state, you might want to reset the session.
            // This depends heavily on the business logic of your bot.
            // Example:
            // if (context['done']) {
            //   delete sessions[sessionId];
            // }

            // Updating the user's current session state
            sessions[sessionId].context = context;
          }
        }
      );
});

http.createServer(bot.middleware()).listen(3000)
const sessions = {};

const findOrCreateSession = (fbid) => {
	"use strict";
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

const replyToBot = () => {
	bot.sendMessage(fbid, globalMessage, function(reply){
		console.log(reply);
	})
}