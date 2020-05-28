//change details about your app
const client = new hivesigner.Client({
  app: 'fbslo-b',
  callbackURL: 'http://localhost:8080',
  scope: ['vote', 'comment']
});

//check if there is token in URL
(function(){
	let params = (new URL(location)).searchParams; //get access token from URL
	const token = params.get('access_token') || localStorage.getItem('sc_token');
	if(token != '' && token != 'null' && token != null){
		localStorage.setItem('sc_token', token); //store token to local storage
		client.setAccessToken(token); //add token to client
	}
})()

function hs_helper_isUserSaved(){
  setAccessToken()
}

function  hs_helper_login() {
	params = {}
	client.login(params, function(err, token) {
		console.log(err, token)
	});
}

function hs_helper_logout(){
	client.revokeToken(function (err, res) {
	  console.log(err, res)
	});
	localStorage.removeItem('sc_token');
}

function setAccessToken(){
	let params = (new URL(location)).searchParams; //get access token from URL
	const token = params.get('access_token') || localStorage.getItem('sc_token');
	if(token != '' && token != 'null' && token != null){
		localStorage.setItem('sc_token', token); //store token to local storage
		client.setAccessToken(token); //add token to client
		return true;
	} else {
		return false;
	}
}

async function hs_helper_get_user_details(){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.me(function (err, res) {
		  console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_vote(voter, author, permlink, weight){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.vote(voter, author, permlink, weight, function (err, res) {
			console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, res) {
		  console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_delete_comment(author, permlink){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.deleteComment(author, permlink, function (err, res) {
		  console.log(err, res)
		})
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_custom_json(requiredAuths, requiredPostingAuths, id, json){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.customJson(requiredAuths, requiredPostingAuths, id, json, function (err, res) {
		  console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_transfer(to, amount, memo){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		const op = ['transfer', {
		  from: '__signer',
		  to: to,
		  amount: amount, //format: 1.000 HIVE
			memo: memo
		}];
		hivesigner.sendOperation(op, {}, function(err, result) {
		  console.log(err, result);
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_reblog(account, author, permlink){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.reblog(account, author, permlink, function (err, res) {
		  console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_follow(follower, following){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.follow(follower, following, function (err, res) {
		  console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_unfollow(unfollower, unfollowing){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.unfollow(unfollower, unfollowing, function (err, res) {
		  console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_ignore(follower, following){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.ignore(follower, following, function (err, res) {
		  console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}

async function hs_helper_claim_balance(account, rewardHive, rewardHbd, rewardVests){
	let isTokenSet = await setAccessToken()
	if(isTokenSet){
		client.claimRewardBalance(account, rewardSteem, rewardSbd, rewardVests, function (err, res) {
		  console.log(err, res)
		});
	} else {
		console.log('Access token is not available!')
	}
}
