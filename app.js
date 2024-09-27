require('dotenv').config();
const express = require('express');

const session = require('express-session');
const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;
const { ApiClient } = require('@twurple/api');

const { AppTokenAuthProvider } = require('@twurple/auth');
// const { ClientCredentialsAuthProvider } = require('@twurple/auth');

const { EventSubWsListener } = require('@twurple/eventsub-ws');
const { App } = require('@slack/bolt');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '';
const TWITCH_SECRET = process.env.TWITCH_CLIENT_SECRET || '';
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || '';
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || '';
const PORT = process.env.PORT || 3000;

const usersToCheck = ['yuck_amok', 'Cluster__'];

const authProvider = new AppTokenAuthProvider(TWITCH_CLIENT_ID, TWITCH_SECRET);
const apiClient = new ApiClient({ authProvider });

const app = express();

async function checkUsersAndNotify() {
	for (const user of usersToCheck) {
			const live = await isUserLive(user);
			if (live) {
					await postToSlackChannel(`${user} is live on Twitch!`);
			}
	}
}

async function isUserLive(userName) {
	const user = await apiClient.users.getUserByName(userName);
	if (!user) return false;
	const stream = await apiClient.streams.getStreamByUserId(user.id);
	return stream !== null; // Returns true if live
}

const slackApp = new App({
	token: SLACK_BOT_TOKEN,
	signingSecret: SLACK_SIGNING_SECRET,
});

async function postToSlackChannel(message) {
	await slackApp.client.chat.postMessage({
			channel: 'G013VQ2EAE4',
			text: message,
	});
}

async function checkUsersAndNotify() {
	for (const user of usersToCheck) {
			const live = await isUserLive(user);
			if (live) {
					await postToSlackChannel(`${user} is live on Twitch!`);
			}
	}
}

// Check every 5 minutes
setInterval(checkUsersAndNotify, 5 * 60 * 1000);

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});