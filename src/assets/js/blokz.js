"use strict";

let blokz = 'test';
let titleset = "";
let year = new Date();
let now = new Date().toISOString().split('.')[0];
let tag = "null";
let post = false;
let userLatest = undefined;
let pageURL = window.location.origin;
let state = "/";
let params = (new URL(location)).searchParams;
let update = false;
let hiveuser = undefined;
let reactionCount;
let postedon;
let thisPost;
let easyMDE;
let oldestPermLink = "";
let md = new Remarkable();
md.set({
  html: true,
  breaks: true,
  xhtmlOut: true,
  linkify: true
});

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("blokztop").style.display = "block";
  } else {
    document.getElementById("blokztop").style.display = "none";
  }
}

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
let parentAuthor = '';
let parentPermlink = "personalcommunity";
function modalOnclick(author, commentpermlink) {
  document.getElementById("myModal").style.display = "block";
  console.log("author :" + author);
  console.log("commentpermlink :" + commentpermlink);
  if (author !== undefined) {
    document.getElementById("replyingToContainer").style.display = "block";
    document.getElementById("replyingTo").value = commentpermlink;
    document.getElementById("replyingToWho").value = author;
    parentAuthor = author;
    parentPermlink = commentpermlink;
  } else {
    document.getElementById("replyingToContainer").style.display = "none";
    console.log("defaults");
  }

  // console.log('button works')
}

// When the user clicks on <span> (x), close the modal
function closeMe() {
  document.getElementById("myModal").style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == document.getElementById("myModal")) {
    document.getElementById("myModal").style.display = "none";
  }
}

function words(str) {
  str = str.replace(/(^\s*)|(\s*$)/gi, "");
  str = str.replace(/[ ]{2,}/gi, " ");
  str = str.replace(/\n /, "\n");
  return str.split(' ').length;
}


function logout() {
  let url = "../#loggedout";
  localStorage.removeItem('hive');
  localStorage.removeItem('hiveKeychainVerified');
  window.location.href = url;
  setTimeout(continueLogout, 1000);
}

function continueLogout() {
  window.location.reload();
}

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

function hidecomm() {

  document.getElementById("comments").style.display = "none";
  document.getElementById("display").style.display = "none";
}

function updatePage() {
  // console.log("welcome to updating a profile");
  if (localStorage.getItem("hive") !== null) {
    hiveuser = localStorage.getItem("hive");
    // console.log(typeof hiveuser)
    // console.log(hiveuser);

    document.getElementById("hiveuser").value = hiveuser;
    hiveuserUp()
  } else {
    // console.log("user does not exist! or something went wrong");

    document.getElementById('upprofile').innerHTML = "<strong>Please inpute a username on the <a href='../'>homepage</a></strong>";
  }
  hidecomm();
}

function login(username) {
  username = document.getElementById('login').value;
  localStorage.setItem("hive", username);


  let url = "../?hive=" + username;
  window.location.href = url;


}


function blokzmenu() {
  let x = document.getElementById("blokzmenuPOP");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function loadChips() {
  function ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  ready(function () {
    new window['MaterialChipInput'](document.getElementById('interests'));
    new window['MaterialChipInput'](document.getElementById('favorites'));
  });
}

function genTags(item, index) {
  document.getElementById("display").innerHTML += "<a href='?tag=" + item + "'>" + item + "</a> &nbsp;";
}

function hiveuserUp() {
  // console.log("TRIGGERED!!!");
  let hiveuserUP = document.getElementById("hiveuser").value;
  // console.log(hiveuserUP);
  hive.api.getContent(hiveuser, 'blokzprofile', function (err, result) {
    // populate data
    if (result) {
      console.log("results are in:");
      console.log(result);
      //       var blokzmeta = JSON.parse(result.json_metadata);
     // OLD let blokify = JSON.parse(JSON.stringify(result[0].body));
     // OLD let blokzmeta = JSON.parse((result[0].json_metadata));
      // console.log(blokify);
      // console.log("blokzmeta: " + blokzmeta);
      // console.log(blokzmeta.blokz);
      let bitff = JSON.parse(result.json_metadata);
      console.log(bitff);
      document.getElementById("name").value = bitff.name;
      easyMDE.value(bitff.article);
      document.getElementById("usertitle").value = bitff.usertitle;
      document.getElementById("birthyear").value = bitff.birthyear;
      document.getElementById("location").value = bitff.location;
      document.getElementById("gender").value = bitff.gender;
      document.getElementById("interest").value = bitff.interests;
      document.getElementById("favorite").value = bitff.favorites;
      document.getElementById("favsite").value = bitff.favsite;
      loadChips();
    } else {
      reject(err);
    }
  });
}





// uses private posting key to update profile
function updateProfile() {
  let data = "<img src='https://personal.community/images/logo512.png'><br />I've created a <a href='https://personal.community'>personal.community</a> profile, please check it out here:<br /> <a href='https://personal.community/?hive=" + document.getElementById('hiveuser').value + "' target='_blank'>personal.community/?hive=" + document.getElementById('hiveuser').value + "</a>";
  let article = easyMDE.value();
  let name = document.getElementById('name').value;
  let favsite = document.getElementById('favsite').value;
  let usertitle = document.getElementById('usertitle').value;
  let birthyear = document.getElementById('birthyear').value;
  //var sign = document.getElementById('sign').value;
  let gender = document.getElementById('gender').value;
  let location = document.getElementById('location').value;
  let interests = document.getElementById('interest').value;
  let favorites = document.getElementById('favorite').value;


  // console.log("proof: " + favsite + article + name + usertitle + birthyear + gender + location + interests + favorites);

  let upwho = document.getElementById('hiveuser').value;

  const beneProfile = [
    "comment_options",
    {
      "author": "sn0n",
      "permlink": "blokzprofile",
      "max_accepted_payout": {
        "amount": "1000000",
        "precision": 3,
        "nai": "@@000000013"
      },
      "percent_hbd": 63,
      "allow_votes": true,
      "allow_curation_rewards": true,
      "extensions": [
        {
          "beneficiaries": [{ "account": "blokz", "weight": 4200 }]
        }
      ]
    }
  ];

  const bene = Object.create(beneProfile);

    hive.broadcast.comment(
      document.getElementById('postingKey').value,
      '', //author
      'blokzprofile', //firsttag
      document.getElementById('hiveuser').value,
      'blokzprofile', //permlink
      'My Personal.Community Profile',
      data,
      // json meta
      {
        tags: ['blokz'],
        app: 'blokz',
        article: article,
        name: name,
        favsite: favsite,
        usertitle: usertitle,
        birthyear: birthyear,
        gender: gender,
        location: location,
        interests: interests,
        favorites: favorites
      },
      function (err, result) {
        if (err)
          document.getElementById('upprofile').innerHTML = "<h3>something went wrong...</h3>" + err;
        else
          document.getElementById('upprofile').innerHTML = "<h3> Please wait while updating profile...</h3>";

        setTimeout(() => {
          let url = "../?hive=" + upwho;
          window.location.href = url;
        }, 8000);

        // localStorage.setItem("hive", (document.getElementById('hiveuser').value));
        // window.location.href = '../';
      }
    );
  
}

let reply

function createPost() {
  console.log("begin creating post process")
  let postTitle = document.getElementById('postTitle').value;
  let ran = AES256.encrypt(postTitle, postTitle);
  ran = ran.substring(1, 6);
  // console.log("ran is : " + ran);
  let permbuilder = document.getElementById('postTitle').value.replace(/[^A-Za-z]+/g, '-').toLowerCase();
  let postpermLink = permbuilder + "-" + ran.toLowerCase();
  // console.log("perm link " + postpermLink);
  let postData = easyMDE.value();
  // console.log("document.getElementById('postingKey').value " + document.getElementById('postingKey').value);
  // console.log(hiveuser);
  let postingAs = localStorage.getItem("hive");
  // console.log("replying to : " + reply)
  // let setTags = "['testing', 'blokz', 'test']";
  console.log('a');
  // todo: reply to comments and posts

  if (window.hive_keychain) {
    console.log('b');
    console.log('keychain post or comment');
    console.log("commenting to :" + parentPermlink);
    // comment.get_parent_id() == parent_comment.get_id(): The parent of a comment cannot change.
    let postAs = localStorage.getItem("hiveKeychainVerified");
    hive_keychain.requestPost(
      postAs,
      postTitle,
      postData,
      parentPermlink,
      parentAuthor,
      {
        tags: ['blokz'],
        app: 'blokz',
      },
      postpermLink,
      '',
      function (response) {
        document.getElementById("createpostbox").innerHTML = "<h3>something went wrong... click the x or outside the box to close</h3>" + response;
        document.getElementById("createpostbox").innerHTML = "<h3>view post: <a href='../?post=" + postAs + "/" + postpermLink + "'>" + postpermLink + "</a></h3> click the x or outside the box to close<br />" + response;
        // localStorage.setItem("hive", (document.getElementById('hiveuser').value));
        // window.location.href = '../';
      }
    );
    // console.log(hiveuser + " connected");
  } else {
    console.log('c');
    hive.broadcast.comment(
      document.getElementById('postingKey').value,
      parentAuthor, //author
      parentPermlink, //firsttag
      postingAs,
      postpermLink, //permlink
      postTitle,
      postData,
      {
        tags: ['blog'],
        app: 'blokz'
      },
      function (err, result) {
        if (err)
          document.getElementById("display").innerHTML = "<h3>something went wrong... click the x or outside the box to close</h3>" + err;
        else
          document.getElementById("display").innerHTML = "<h3>view post: <a href='../?post=" + postingAs + "/" + postpermLink + "'>" + postpermLink + "</a></h3> click the x or outside the box to close<br />" + result;


        /*setTimeout(() => {
          let url = "../?hive=" + hiveuser;
          window.location.href = url;
        }, 8000); */

        // localStorage.setItem("hive", (document.getElementById('hiveuser').value));
        // window.location.href = '../';
      }
    ); // broadcast.comment
  };

}

function upvote(permlink, author) {
  if (window.hive_keychain) {
    if (localStorage.getItem("hiveKeychainVerified") !== null) {

      hiveuser = localStorage.getItem("hiveKeychainVerified");

      let weight = 500;
      hive_keychain.requestVote(hiveuser, permlink, author, weight, function (response) { 
        console.log(response); 
        // todo:  change reaction color

      document.getElementById("thumbs").style.color = "red"; 
      })

      // console.log(hiveuser + " connected");
    } else {
      console.log('keychain not installed');
    };
  }
};

function userRecent() {
  document.getElementById("gridd").style.display = "none";
  // console.log("user connected for showing their latest posts : " + userLatest);
  // get recent posts
  hive.api.getDiscussionsByAuthorBeforeDate(userLatest, null, now, 20, (err, result) => {
    // testing for loop for posts. 
    // data for each post in a loop
    document.getElementById("display").innerHTML += "most recent posts of <h1><a href='../?hive=" + userLatest + "'>" + userLatest + "</a></h1>";
    for (let i = 0; i < result.length; i++) {
      // console.log(" for loop data : " + JSON.stringify(result[i]));
      let thisPost = JSON.parse(JSON.stringify(result[i]));
      // console.log("who dis " + userLatest);
      // console.log("i is " + i);
      // http://127.0.0.1:3000/?post=yabapmatt/some-thoughts-on-the-future
      let whenlatest = Date(thisPost.created.slice(0, 10));
      document.getElementById("display").innerHTML += "<a href='?post=" + userLatest + "/" + thisPost.permlink + "'>" + thisPost.title + "</a><br /> by " + userLatest + " on " + whenlatest + "<br />";
      document.getElementById("comments").style.display = "none";
    }
  });
}
let sanizited;
function sanitize(sanitized) {
  sanitized = sanitizeHtml(sanitized, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'img', 'center', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'sub', 'pre', 'code', 'hr', 'br', 'blockquote', 'table', 'thead', 'th', 'tbody', 'tr', 'td', 'sup', 'sub'],
    allowedAttributes: {
      'img': ['src'],
      'a': ['href']
    },
    allowedIframeHostnames: ['www.youtube.com']
  });
  // console.log("sanitize function complete");
  return sanitized;
}

function displayPost() {
  console.log('displaying post')
  document.getElementById("gridd").style.display = "none";
  var letting = getQueryVariable("post").split("/");
  let author = letting[0].replace("@", '');
  let permlink = letting[1];
  // console.log("letting : " + author + permlink);
  hive.api.getContent(author, permlink, function (err, result) {
 
    let findVoter = JSON.stringify(result.active_votes);
    console.log(findVoter);
    

    let post1 = md.render(result.body).replace("\n", "");
    //post1 = post1.replace(new RegExp("<img ", 'g'), "<img width='80%' ");
    document.getElementById("display").innerHTML += "<div style='font-weight: strong; font-size: 200%; line-height: 100%; padding: .1em;'>" + result.title + "</div>";
    document.getElementById("display").innerHTML += "<br /><a href='../?hive=" + result.author + "' style='text-decoration: none'><button class='mdl-button mdl-js-button mdl-button--fab'><img src='https://images.hive.blog/u/" + result.author + "/avatar'></button> <h4 style='display: inline;'>" + result.author + "</a></h3>";
    let whenagain = new Date(result.created.slice(0, 10)).toDateString();
    whenagain = whenagain.split('GMT');
    let timeToRead = words(result.body) / 3 / 60;
    if (timeToRead < 1) {
      timeToRead = 1;
    }
    document.getElementById("display").innerHTML += "<div style='float: right; padding-top: 2em;'> Reading time: " + timeToRead.toFixed(0) + " min</div>";


    document.getElementById("display").innerHTML += "<br />" + whenagain + "<hr />";
    let sanipost = md.render(post1);
    sanipost = sanitize(sanipost);
    sanipost = sanipost.replace(/@[A-Za-z0-9_.-]+[A-Za-z0-9_.]\s/gi, `<a href="../?hive=$&">$&</a>`);
    // sanipost = sanipost.replace('<a href="../?hive= ', `<a href="../?hive=`);






    document.getElementById("display").innerHTML += sanipost;
    // console.log("SANITATION TEST post output" + sanipost);
    document.getElementById("display").innerHTML += "<hr /> tags: <br />";
    let jsonTAGS = JSON.parse(result.json_metadata);
    jsonTAGS.tags.forEach(genTags);

    document.getElementById("display").innerHTML += "<hr /><span style='font-size:1em'>Reaction: </span> <span class='material-icons' style='font-size:1em' onClick='upvote(`" + permlink + "`,`" + author + "`)' id='thumbs'>thumb_up</span> ";

    // TODO : color reaction 
    if (findVoter.search(localStorage.getItem("hive")) > 0) {
      console.log("user found, you have upvoted this");
      document.getElementById("thumbs").style.color = "red";
    } else {
      console.log('you have yet to upvote this post')
    }

    // todo : comments
    document.getElementById("comments").innerHTML += `<h3>Comments</h3> <div style='padding: 5px'><button onclick='modalOnclick("` + author + `","` + permlink + `")'>reply</button></div>`;
    hive.api.getContentReplies(author, permlink, function (err, result) {
      // console.log(err, result);
      if (result.length > 0) {
        // console.log("testing number " + result.length)
        let comments = JSON.stringify(result[0].author);
        for (var i = 0; i < result.length; i++) {
          // console.log(" for loop data : " + JSON.stringify(result[i]));
          let thisPost = JSON.parse(JSON.stringify(result[i]));
          // console.log("who dis " + thisPost.author);
          // console.log("i is " + i);
          let sanicomm = md.render(md.render(result[i].body));
          sanicomm = sanicomm.replace(/@[A-Za-z0-9_.]\w+[A-Za-z0-9_.]\b/gi, "<a href='../?hive=$&'>$&</a>");

          console.log(sanicomm);
          sanicomm = sanitize(sanicomm);
          document.getElementById("comments").innerHTML += "<div id='comm'>  <a class='mdl-chip mdl-color--blue-grey mdl-chip--contact mdl-chip--deletable' href='../?hive=" + thisPost.author + "'><img class='mdl-chip__contact mdl-color--light-blue' src='https://images.hive.blog/u/" + thisPost.author + "/avatar' alt='avatar'></img><span class='mdl-chip__text' style='font-weight: bold; color: white'>" + thisPost.author + " &nbsp;</span></a>  <div style='padding:2em'>" + sanicomm + "</div> <div style='text-align: right'><a href='?post=@" + thisPost.author + "/" + thisPost.permlink + "'>permlink & replies</a></div></div>";
          // if parent_author is listed, put on top of post
        }
        // console.log("comment from: " + comments);

      } else {

        // console.log("no comments");
        document.getElementById("comments").innerHTML += "no comments to show";

      }

    });

  });
}





function nonBlokzUser(hiveuser) {

  // LOAD GENERIC posting_json_metadata for non blokz/profile user
  // console.log("user does not exist! or something went wrong")
  hive.api.call('database_api.find_accounts', { accounts: [hiveuser] }, (err, res) => {
    let posting_json = JSON.parse(JSON.stringify(res.accounts[0].posting_json_metadata));
    // console.log("posting_json: " + posting_json);

    document.getElementById("profimg").src = "https://images.hive.blog/u/" + hiveuser + "/avatar";
    document.getElementById("coverimage").style.backgroundImage = "url('https://images.hive.blog/0x0/" + JSON.parse(posting_json).profile.cover_image + "')";
    if (JSON.parse(posting_json).profile.website !== undefined) {
      let saniweb = JSON.parse(posting_json).profile.website;
      let saniwebsite = sanitize(saniweb);
      document.getElementById("favsite").innerHTML = "<a href='" + saniwebsite + "' target='_blank'>" + saniwebsite + "</a>";
    } else {
      document.getElementById("strongWebsite").style.display = "none";
    }
    if (JSON.parse(posting_json).profile.location !== undefined) {
      let saniloc = JSON.parse(posting_json).profile.location;
      let sanilocation = sanitize(saniloc);
      document.getElementById("location").innerHTML = sanilocation;
    } else {
      document.getElementById("strongLocation").style.display = "none";
    }
    if (JSON.parse(posting_json).profile.about !== undefined) {
      let saniabo = JSON.parse(posting_json).profile.about;
      let saniabout = sanitize(saniabo);
      titleset = saniabout;
    } else {
      titleset = "";
    }


    // document.getElementById("toptab").style.display = "none";
    document.getElementById("strongLocation").style.display = "none";
    document.getElementById("strongAbout").style.display = "none";
    document.getElementById("location").style.display = "none";
    document.getElementById("comments").style.display = "none";
    document.getElementById("nonuser").innerHTML = "<h3> no personal.community page setup</h3>";
    document.getElementById("nonuser").style.textAlign = "center"
    document.getElementById("usertitle").innerHTML = titleset;
    document.getElementById("name").innerHTML = hiveuser;
    // document.getElementById("strongInterests").style.display = "none";
    document.getElementById("strongAge").style.display = "none";
    document.getElementById("strongGender").style.display = "none";
    document.getElementById("strongAbout").style.display = "none";
    document.getElementById("age").style.display = "none";
    document.getElementById("gender").style.display = "none";


    //// console.log("Location: " +JSON.parse(posting_json).profile.location);

  });
  // finished displaying posting_json_metadata for non blokz/profile user

}




function splash() {

  document.getElementById("gridd").style.display = "none";
  // console.log("splash engaged");
  var html = `<div id='splash'><img src="../images/logo192.png"><br />` +
  `<h6 style="margin-bottom: 2px; padding: 2px;">Welcome to </h6>`+ 
  `<h3>personal.community</h3>` +


    //`    </div>` +
    `<hr />The <a href='https://blokz.io/'><img src="../images/favicon.png" style="height:16px" /></a> icon down below is the app menu.` + 
    `<br /> This is used to navigate site past this page<br /> ` +
    `<hr />Made with &#10084; by <br /><a class='mdl-chip mdl-chip--contact mdl-chip--deletable' href='../?hive=sn0n'><img class='mdl-chip__contact mdl-color--pink' src='https://images.hive.blog/u/sn0n/avatar'></img><span class='mdl-chip__text'>sn0n &nbsp;</span></a></div>`;
  var tempElement = document.createElement('splash');
  tempElement.innerHTML = html;
  document.getElementsByTagName('body')[0].appendChild(tempElement.firstChild);


  
}

if (getQueryVariable("hive") !== false) {
  if (localStorage.getItem("hive") === null) {
    // localStorage.setItem("hive", getQueryVariable("hive"));
  }
  hiveuser = getQueryVariable("hive").replace('@', '');
  // console.log(hiveuser + " connected");
}






if (getQueryVariable("tag") !== false) {
  tag = getQueryVariable("tag");
  hiveuser = undefined;
}

if (getQueryVariable("post") !== false) {
  post = "true";
  hiveuser = undefined;
}
 
hive.api.setOptions({ url: 'https://api.hive.blog' });

function buildprofile(hiveuser) {

  // console.log("fetching profile for : " + hiveuser)

  // gets posting_json_metadata for generic profile data for user
  hive.api.call('database_api.find_accounts', { accounts: [hiveuser] }, (err, res) => {
    console.log(res, err);
    let posting_json = JSON.parse(JSON.stringify(res.accounts[0].posting_json_metadata));
    // TODO: -- remove testing notes ^>^
    // console.log("posting_json: " + posting_json);
    // display avater


    // https://images.hive.blog/u/" + result.author + "/avatar
    let useravatar = "https://images.hive.blog/u/" + hiveuser + "/avatar";
    document.getElementById("profimg").src = useravatar;
    // display cover image
    document.getElementById("coverimage").style.backgroundImage = "url('https://images.hive.blog/0x0/" + JSON.parse(posting_json).profile.cover_image + "')";
  });

  hive.api.getDiscussionsByAuthorBeforeDate(hiveuser, null, now, 10, (err, result) => {
    // testing for loop for posts. 
    // data for each post in a loop
    //document.getElementById("blog").innerHTML += "most recent posts of <h1><a href='../?hive=" + hiveuser + "'>" + hiveuser + "</a></h1>";
    for (var i = 0; i < result.length; i++) {

      // testing for replies 
       // console.log(" for loop data : " + JSON.stringify(result[i]));
       // console.log("who dis " + hiveuser);
       // console.log("i is " + i);
      // http://127.0.0.1:3000/?post=yabapmatt/some-thoughts-on-the-future
      reactionCount = result[i].active_votes.length;
      // console.log('post created on : ' + result[i].created);
      let postedon = new Date(result[i].created.slice(0, 10)).toDateString();
      postedon = postedon.split('GMT');
      document.getElementById("blog").innerHTML += "<a href='?post=" + hiveuser + "/" + result[i].permlink + "'>"
        + result[i].title + "</a><br /> by " + hiveuser + " on " + postedon + " | <span class='material-icons' style='font-size:12px'>thumbs_up_down</span> " + reactionCount + "<hr />";

    }
  });


  // show link to peakd profile
  // TODO : remove link 
  document.getElementById("hiveuser").innerHTML = "<br /><a href='http://peakd.com/@" + hiveuser + "' target='_peakd'><img src='../images/peakd.png'></a> &#8226; ";
  document.getElementById("hiveuser").innerHTML += "<a href='http://hivestats.io/@" + hiveuser + "' target='_hivestats'><img src='../images/hivestats.ico'></a> &#8226; ";
  document.getElementById("hiveuser").innerHTML += "<a href='https://hive-engine.com/?p=balances&a=" + hiveuser + "' target='_hiveengine'><img src='../images/hive_engine.png' height='32px' width='32px'></a> &#8226; ";
  document.getElementById("hiveuser").innerHTML += "<a href='https://dcity.io/city?c=" + hiveuser + "' target='_dcity'><img src='../images/dcity.png' height='32px' width='151px'></a>  ";
  // https://hiveblocks.com/@
  // fetch blokzprofile post from hive
  hive.api.getContent(hiveuser, 'blokzprofile', function (err, result) {
  // hive.api.getDiscussionsByAuthorBeforeDate(hiveuser, 'blokzprofile', now, 1, (err, result) => {
    // user has a blokz/profile
    console.log("whats goin on here?")
    console.log(err, result)
    if (result) {
      // console.log("meep :" + JSON.stringify(result));
      var blokzmeta = JSON.parse(result.json_metadata);
      console.log("test " + blokzmeta.article);
      // console.log("what is blokify " + blokify);
      var bitff = JSON.parse(JSON.stringify(blokzmeta));
      // console.log("blokzmeta: " + bitff.app);
      // console.log(bitff.interests);
      document.getElementById("name").innerHTML = sanitize(blokzmeta.name);
      document.getElementById("article").innerHTML = sanitize(md.render(blokzmeta.article));
      // ~~~ md.render(blokzmeta.article).replace("\n", "");
      document.getElementById("usertitle").innerHTML = sanitize(blokzmeta.usertitle);
      var profage = year.getFullYear() - sanitize(blokzmeta.birthyear);
      document.getElementById("age").innerHTML = profage;
      document.getElementById("location").innerHTML = sanitize(blokzmeta.location);
      document.getElementById("gender").innerHTML = sanitize(blokzmeta.gender);
      document.getElementById("favsite").innerHTML = "<a href='" + sanitize(blokzmeta.favsite) + "' target='_blank'>" + sanitize(blokzmeta.favsite) + "</a>";
      // interests
      var skills = sanitize(bitff.interests);
      let skillsLog = skills.split(',');
      skillsLog.forEach(function (entry) {
        console.log(entry);
        let entryy = entry; //.replace(/\s+/g, '');
        // entryy = entryy.replace(/[^a-zA-Z0-9]/g, '');
        entryy = entryy.toLowerCase();
        // creat chips for each interest
        // todo: parse for communities and update those 'hive-'
        var vadd = document.createElement('button');
        vadd.className = "mdl-chip";
        vadd.id = entryy;
        vadd.setAttribute("onclick", "window.location.href='/?tag=" + entryy + "';");
        document.getElementById("interests").appendChild(vadd);
        var sadd = document.createElement('span');
        sadd.className = "mdl-chip__text";
        sadd.id = entryy + "2";
        document.getElementById(entryy).appendChild(sadd);
        var t = document.createTextNode("#" + entryy);
        document.getElementById(entryy + "2").appendChild(t);
        // ENDNEW
      });
      // favorite steemians
      var favs = sanitize(bitff.favorites);
      // console.log("favs : " + favs);
      let favsLog = favs.split(',');
      favsLog.forEach(function (entry) {
        // console.log("show: " + entry);
        let entryy = entry.replace(/\s+/g, '');
        entryy = entryy.toLowerCase();
        // CURRENT TODO: FRIEND IMAGE
        // console.log("CAUGHT: " + entryy);
        var favfriend = document.createElement("div");
        favfriend.id = entryy + "_";
        favfriend.setAttribute("onclick", "window.location.href='./?hive=" + entryy + "';");
        favfriend.style = "display: inline-block; padding: 5px; margin: 15px auto;width: 100px;  text-align: center"
        document.getElementById("favorites").appendChild(favfriend);
        var para = document.createElement("div");                 // Create a <p> element
        para.id = favfriend.id + "sub";
        var ffs = document.createElement("div");
        ffs.id = favfriend.id;
        var ffsName = document.createElement("div");
        ffsName.id = favfriend.id + "ffsName";
        var ff = favfriend.id + "NEW";   // placeholder
        document.getElementById(entryy + "_").appendChild(para);
        document.getElementById(ffs.id).appendChild(ffsName);
        var image = document.createElement("img");
        var imageParent = document.getElementById(para.id);
        image.className = "avatar";
        image.src = "https://images.hive.blog/u/" + entryy + "/avatar";            // image.src = "IMAGE URL/PATH"
        imageParent.appendChild(image);
        document.getElementById(entryy + "_").appendChild(ffsName);
        ffsName.innerHTML = "<small id='" + ff + "'>" + entryy + "</small>";
      }); // finished displaying blokzprofile
    } else {
      nonBlokzUser(hiveuser);
    }
    hidecomm();
  });
  document.title = hiveuser + "'s personal.community profile";
}

function showtag(tag) {
  document.getElementById("gridd").style.display = "none";
  hive.api.getDiscussionsByCreated({ "tag": tag, "limit": 10 }, function (err, result) {
    if (err === null) {
      var i, len = result.length;
      document.getElementById("display").innerHTML += "<small>most recent</small><div style='font-size: 300%; padding: .1em; margin: .2em'>#" + tag + " posts</div><br />";
      for (i = 0; i < len; i++) {
        var discussion = result[i];
        // console.log(i, discussion);
        // console.log("who dun it " + discussion.author);
        // console.log("where do i find it? @" + discussion.author + "/" + discussion.permlink);
        let whenbytag = new Date(discussion.created.slice(0, 10)).toDateString();
        whenbytag = whenbytag.split('GMT');
        let reactioncount = result[i].active_votes.length;
        document.getElementById("display").innerHTML += "<a href='?post=@" + discussion.author + "/" + sanitize(discussion.permlink) + "'>" + sanitize(discussion.title) + "</a><br /> by " + discussion.author + " on " + whenbytag + " | <span class='material-icons' style='font-size:12px'>thumbs_up_down</span> " + reactioncount + "<hr />";
        document.getElementById("comments").style.display = "none";
      }
    } else {
      console.log(err);
    }
  });
}

// MAIN()
window.onload = function loading() {


  if (getQueryVariable("loginas") !== false) {
    if (localStorage.getItem("hive") === null) {
      localStorage.setItem("hive", getQueryVariable("loginas"));
      
    }
    hiveuser = getQueryVariable("loginas");
    if (window.hive_keychain) {
      function keyChainPassing(keychainpass) {
        hive_keychain.requestHandshake(function () {
          console.log("Handshake received!");
        })
        hive_keychain.requestSignBuffer(keychainpass, 'Login', 'Posting',
          (response) => {
            console.log(response)
            if (response.success) {
              // all is well!
              console.log("success;");
              localStorage.setItem("hiveKeychainVerified", hiveuser);
            };
          });
      };

      keyChainPassing(hiveuser);
      // console.log(hiveuser + " connected");
    } else {
      console.log('keychain not installed')
    };
  };

  if (localStorage.getItem("hive") !== null) {
    let loggedinas = localStorage.getItem("hive");
    document.getElementById("loggedin").innerHTML = "<div style='float: right'><button onclick='logout()'><i class='material-icons'>exit_to_app</i></button></div> <div style='padding-top: 3px;'><a href='../?hive=" + loggedinas + "' style='text-decoration: none'><button class='mdl-button mdl-js-button mdl-button--fab'><img src='https://images.hive.blog/u/" + loggedinas + "/avatar'></button> " + loggedinas + "</a></div> ";
    document.getElementById("loggedin").innerHTML += "<br /><a href='../?newpost=true'>New Post</a>";
  }

  if (update !== true && localStorage.getItem("hive") !== null) {
    document.getElementById('showUpdate').innerHTML = "<a href='../profile_update/'>Update Profile</a>";
  }

  if (tag !== "null") {
    showtag(tag);
  } else if (getQueryVariable("newpost") !== false) { 
    console.log("NEW POST");
    document.getElementById("display").innerHTML = `
    <div class="mdl-textfield mdl-js-textfield">
      <small>Post Title</small><input class="mdl-textfield__input" type="text" id="postTitle">
      <label class="mdl-textfield__label" for="postTitle" id="postTitleLabel"></label>
    </div>

    <div class="mdl-textfield mdl-js-textfield">
      <small>Post Body</small>
      <textarea id="postBody"></textarea>


      <label class="mdl-textfield__label" for="postBody" id="postBodyLabel"></label>
    </div>


    <div class="mdl-textfield mdl-js-textfield">
      <small>Private Posting Key:</small><input class="mdl-textfield__input" type="password" id="postingKey">
      <label class="mdl-textfield__label" for="postingKey"></label>

    </div>
    <div>
      <button type="button" id="nextBtn" onclick="createPost()"
        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
        data-upgraded=",MaterialButton,MaterialRipple">Create Post</button>
    </div>`;
    easyMDE = new EasyMDE({element: document.getElementById('postBody')});
    console.log("this is " + easyMDE);
    document.getElementById("gridd").style.display = "none";

    document.getElementById("comments").style.display = "none";

  } else if (post === "true") {
    document.body.style.background = "#333 url(../images/back.png) no-repeat center center fixed";
  
    displayPost();
  } else if (userLatest !== undefined) {
    userRecent();
  } else if (hiveuser !== undefined) {
    buildprofile(hiveuser)
  } else if (update === true) {
    updatePage();
  } else if (localStorage.getItem("hive") !== null) {
    buildprofile(localStorage.getItem("hive"));
  } else {
    splash();
    hidecomm();
  };

 
  if (getQueryVariable("hive") === localStorage.getItem("hive")) {
    console.log("this is my page");
    document.getElementById("toptab").click()
  }

  /*
  genCommunityChip()
  function genCommunityChip() {
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
  }
  */
 
}


