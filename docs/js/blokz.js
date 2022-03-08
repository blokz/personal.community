"use strict";
// begin code for 404 routes (https://personal.community/@sn0n/blokzprofile , etc...)
// EXAMPLE URLS : 
// TODO : https://personal.community/@sn0n/feed (feed isnt a permlink)
// TODO : https://personal.community/created/blog
// TODO : https://personal.community/trending/blog
// https://personal.community/@sn0n
// https://personal.community/crypto/@sn0n/had-to-login-to-cryptocom-again-you-arent-alone
// https://personal.community/@sn0n/blokzprofile/

if (window.location.hash.length > 1) {
  const path = window.location.hash.replace('#/', '')
  // console.log(path)
  let routes = ''
  const path2 = path.split("/")
  if (path2[0].charAt(0) == "@") {
    //  console.log("@{USERNAME} Found");
    routes = path2[0];
    //  console.log("checking for post");
    if (path2[1] !== undefined) {
      //    console.log("i found a post here: " + path2[1]);
      routes = routes + "/" + path2[1];
      history.pushState({ page: 1 }, "Some title", '?post=' + routes)
    } else {
      //    console.log("no post found, redirecting to ?hive=")
      history.pushState({ page: 1 }, "Some title", '?hive=' + routes)
    }
  } else {
    //  console.log("@ NOT Found ");
    if (path2[1].charAt(0) == "@") {
      //   console.log("@{USERNAME} Found after a first tag");
      routes = path2[1]
    }
    if (path2[2] !== undefined) {
      //   console.log("but i found a post here: " + path2[2])
      routes = routes + "/" + path2[2]
    }
    history.pushState({ page: 1 }, "Some title", '?post=' + routes)
    //  console.log("this be thy path out: " + routes)
  }

  location.reload();
}

































hive.api.setOptions({ url: 'https://api.hive.blog' });
let url = "https://api.hive.blog";
let postdesc;
let blokz = 'test';
let titleset = "";
let year = new Date();
let now = new Date().toISOString().split('.')[0];
let tag = "null";
let post = false;
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

function strip(html) {
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

function truncate(str, no_words) {
  return str.split(" ").splice(0, no_words).join(" ");
}

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


let parentAuthor = '';
let parentPermlink = '';
function replyClick(author, commentpermlink) {


  // console.log("author :" + author);
  // console.log("commentpermlink :" + commentpermlink);
  /*  if (author !== undefined) {
      document.getElementById("replyingToContainer").style.display = "block";
      document.getElementById("replyingTo").value = commentpermlink;
      document.getElementById("replyingToWho").value = author;
      parentAuthor = author;
      parentPermlink = commentpermlink;
    } else {
      document.getElementById("replyingToContainer").style.display = "none";
      console.log("defaults");
    } 
    */

  window.location.href = "/?newpost=true&author=" + author + "&permlink=" + commentpermlink;

}






function words(str) {
  str = str.replace(/(^\s*)|(\s*$)/gi, "");
  str = str.replace(/[ ]{2,}/gi, " ");
  str = str.replace(/\n /, "\n");
  return str.split(' ').length;
}


function logout() {
  let url = "/";
  localStorage.removeItem('hive');
  localStorage.removeItem('verified');
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

    document.getElementById('upprofile').innerHTML = "<strong>Please browse as user on the <a onclick='blokzmenu()'>menu</a> below before accessing this page.</strong>";
  }
  hidecomm();
}

function login(username) {
  username = document.getElementById('login').value;
  localStorage.setItem("hive", username);
}

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
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

function loadTags() {
  function ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  ready(function () {
    new window['MaterialChipInput'](document.getElementById('tags'));
  });
}

function genTags(item, index) {
  document.getElementById("display").innerHTML += "<a href='?tag=" + item + "'>" + item + "</a> &nbsp;";
}

function genChips(item, index) {
  document.getElementById("display").innerHTML += "<a class='mdl-chip mdl-chip--contact mdl-chip--deletable' href='?tag=" + item + "'><span class='mdl-chip__text'>&nbsp; #" + item + "&nbsp;</span></a>";



}


function hiveuserUp() {
  // console.log("TRIGGERED!!!");
  let hiveuserUP = document.getElementById("hiveuser").value;
  // console.log(hiveuserUP);
  hive.api.getContent(hiveuser, 'blokzprofile', function (err, result) {
    // populate data
    if (result) {
      // console.log("results are in:");
      // console.log(result);
      //       var blokzmeta = JSON.parse(result.json_metadata);
      // OLD let blokify = JSON.parse(JSON.stringify(result[0].body));
      // OLD let blokzmeta = JSON.parse((result[0].json_metadata));
      // console.log(blokify);
      // console.log("blokzmeta: " + blokzmeta);
      // console.log(blokzmeta.blokz);
      let bitff = JSON.parse(result.json_metadata);
      //  console.log(bitff);
      //document.getElementById("name").value = bitff.name;
      easyMDE.value(bitff.article);
      //document.getElementById("usertitle").value = bitff.usertitle;
      //document.getElementById("birthyear").value = bitff.birthyear;
      //document.getElementById("location").value = bitff.location;
      //document.getElementById("gender").value = bitff.gender;
      document.getElementById("interest").value = bitff.interests;
      document.getElementById("favorite").value = bitff.favorites;
      //document.getElementById("favsite").value = bitff.favsite;
      loadChips();
    } else {
      reject(err);
    }
  });
}

function updateProfile() {
  let data = "<img src='https://personal.community/images/logo512.png'><br />I've created a profile on <a href='https://personal.community'>personal.community</a>, please check it out here:<br /> <a href='https://personal.community/@" + document.getElementById('hiveuser').value + "' target='_blank'>personal.community/@" + document.getElementById('hiveuser').value + "</a>";
  let article = easyMDE.value();
  //let name = document.getElementById('name').value;
  //let favsite = document.getElementById('favsite').value;
  //let usertitle = document.getElementById('usertitle').value;
  //let birthyear = document.getElementById('birthyear').value;
  //var sign = document.getElementById('sign').value;
  // let gender = document.getElementById('gender').value;
  // let location = document.getElementById('location').value;
  let interests = document.getElementById('interest').value;
  let favorites = document.getElementById('favorite').value;


  // console.log("proof: " + article + interests + favorites);

  let upwho = document.getElementById('hiveuser').value;

  const beneProfile = [
    "comment_options",
    {
      "author": upwho,
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


  if (window.hive_keychain) {
    //  console.log('b');
    //  console.log('keychain post or comment');
    //  console.log("commenting to :" + parentPermlink);
    let parentPermBC = 'blokzprofile';
    if (parentPermlink.length > 1) {
      parentPermBC = parentPermlink
    } else {
      parentPermBC = "blokzprofile"
    }
    // comment.get_parent_id() == parent_comment.get_id(): The parent of a comment cannot change.
    let postAs = localStorage.getItem("hiveKeychainVerified");

    let profilejson = {
      tags: 'personalcommunity',
      app: 'blokz',
      article: article,
      interests: interests,
      favorites: favorites
    }
    profilejson = JSON.stringify(profilejson)
    let opsBroad = [
      [
        "comment",
        {
          "parent_author": "",
          "parent_permlink": "blokzprofile",
          "author": postAs,
          "permlink": "blokzprofile",
          "title": "My Personal.Community Profile",
          "body": data,
          "json_metadata": profilejson,
        }
      ]
    ];

    hive_keychain.requestBroadcast(postAs, opsBroad, "Posting", function (response) {
      //  console.log("main js response - post");
      // console.log(response);

      //  console.log('hold tight')
      setTimeout(() => {
        let url = "/?hive=" + postAs;
        window.location.href = url;
      }, 8000);


    }

    );
    // console.log(hiveuser + " connected");
  }





}

let reply

function quickReply() {
  // console.log("begin creating post process");
  // console.log("replying to : " + localStorage.getItem('replyAuthor'));
  // console.log(localStorage.getItem('replyLink'));
  let tag = document.getElementById('tag').value;
  //  console.log("tags test: " + tag)
  let postTitle = document.getElementById('postTitle').value;
  let ran = AES256.encrypt(postTitle, postTitle);
  ran = ran.substring(12, 18);
  // console.log("ran is : " + ran);

  let postpermLink = ran.toLowerCase();
  // console.log("perm link " + postpermLink);
  let postData = easyMDE.value();
  // console.log(postData)
  // console.log("document.getElementById('postingKey').value " + document.getElementById('postingKey').value);
  // console.log(hiveuser);
  let postingAs = localStorage.getItem("hive");
  // console.log("replying to : " + reply)
  // let setTags = "['testing', 'blokz', 'test']";
  // console.log('a');
  // todo: reply to comments and posts
  tag = replaceAll(tag, " ", "");

  if (tag.length <= 0) {
    tag += "blog";
  } else {
    tag += ",blog";
  }

  tag = tag.split(",")
  let jsonmeta = {
    tags: tag,
    app: 'blokz'
  }

  jsonmeta = JSON.stringify(jsonmeta)
  // console.log(jsonmeta)

  if (window.hive_keychain) {
    //  console.log('b');
    // console.log('keychain post or comment');
    // console.log("commenting to :" + parentPermlink);
    let parentAuthor = localStorage.getItem('replyAuthor');
    let parentPermBC = localStorage.getItem('replyLink');
    // comment.get_parent_id() == parent_comment.get_id(): The parent of a comment cannot change.
    let postAs = localStorage.getItem("hiveKeychainVerified");
    let opsBroad = [
      [
        "comment",
        {
          "parent_author": parentAuthor,
          "parent_permlink": parentPermBC,
          "author": postAs,
          "permlink": postpermLink.replace(/[^A-Za-z]+/g, '-').toLowerCase() + "pc",
          "title": postTitle,
          "body": postData,
          "json_metadata": jsonmeta
        }
      ],
      [
        "comment_options",
        {
          "author": postAs,
          "permlink": postpermLink.replace(/[^A-Za-z]+/g, '-').toLowerCase() + "pc",
          "allow_votes": true,
          "allow_curation_rewards": true,
          "max_accepted_payout": "1000000.000 HBD",
          "percent_hbd": 10000,
          "extensions": [
            [
              0,
              {
                "beneficiaries": [
                  {
                    "account": "blokz",
                    "weight": 500
                  }
                ]
              }
            ]
          ]
        }
      ]
    ];

    hive_keychain.requestBroadcast(postAs, opsBroad, "Posting", function (response) {
    //  console.log("main js response - post");
    //  console.log(response);

    //  console.log('hold tight')
      setTimeout(() => {
        let url = "/?post=" + postAs + "/" + postpermLink.replace(/[^A-Za-z]+/g, '-').toLowerCase() + "pc";
        window.location.href = url;
      }, 8000);


    }

    );
    // console.log(hiveuser + " connected");
  }

}


function createPost() {
//  console.log("begin creating post process");

  let tag = document.getElementById('tag').value;
 // console.log("tags test: " + tag)
  let postTitle = document.getElementById('postTitle').value;
  let ran = AES256.encrypt(postTitle, postTitle);
  ran = ran.substring(12, 18);
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
  tag = replaceAll(tag, " ", "");

  if (tag.length <= 0) {
    tag += "blog";
  } else {
    tag += ",blog";
  }

  tag = tag.split(",")
  let jsonmeta = {
    tags: tag,
    app: 'blokz'
  }

  jsonmeta = JSON.stringify(jsonmeta)
 // console.log(jsonmeta)
  if (window.hive_keychain) {
  //  console.log('b');
  //  console.log('keychain post or comment');
   // console.log("commenting to :" + parentPermlink);
    let parentPermBC = '';
    if (parentPermlink.length > 1) {
      parentPermBC = parentPermlink
    } else {
      parentPermBC = postpermLink.replace(/[^A-Za-z]+/g, '-').toLowerCase() + "pc"
    }
    // comment.get_parent_id() == parent_comment.get_id(): The parent of a comment cannot change.
    let postAs = localStorage.getItem("hiveKeychainVerified");
    let opsBroad = [
      [
        "comment",
        {
          "parent_author": parentAuthor,
          "parent_permlink": parentPermBC,
          "author": postAs,
          "permlink": postpermLink.replace(/[^A-Za-z]+/g, '-').toLowerCase() + "pc",
          "title": postTitle,
          "body": postData,
          "json_metadata": jsonmeta
        }
      ],
      [
        "comment_options",
        {
          "author": postAs,
          "permlink": postpermLink.replace(/[^A-Za-z]+/g, '-').toLowerCase() + "pc",
          "allow_votes": true,
          "allow_curation_rewards": true,
          "max_accepted_payout": "1000000.000 HBD",
          "percent_hbd": 10000,
          "extensions": [
            [
              0,
              {
                "beneficiaries": [
                  {
                    "account": "blokz",
                    "weight": 500
                  }
                ]
              }
            ]
          ]
        }
      ]
    ];

    hive_keychain.requestBroadcast(postAs, opsBroad, "Posting", function (response) {
     // console.log("main js response - post");
     // console.log(response);

    //  console.log('hold tight')
      setTimeout(() => {
        let url = "/?post=" + postAs + "/" + postpermLink.replace(/[^A-Za-z]+/g, '-').toLowerCase() + "pc";
        window.location.href = url;
      }, 8000);


    }

    );
    // console.log(hiveuser + " connected");
  } else {
    // TODO : blokzlock private key
    // broadcast a new post
   // console.log('c');
    hive.broadcast.comment(
      document.getElementById('postingKey').value,
      parentAuthor, //author
      parentPermlink, //firsttag
      postingAs,
      postpermLink, //permlink
      postTitle,
      postData,
      jsonmeta,
      function (err, result) {
        document.getElementById("displayUpdate").style.display = "block";
        if (err)
          document.getElementById("displayUpdate").innerHTML = "<h3>something went wrong...  try again</h3>" + err;
        else {
          document.getElementById("displayUpdate").innerHTML = "<h3>Redirecting page in 8 seconds<h3>view post: <a href='/?post=" + postingAs + "/" + postpermLink + "'>" + postpermLink + "</a><br />" + result;


          setTimeout(() => {
            let url = "/?post=" + postingAs + "/" + postpermLink;
            window.location.href = url;
          }, 8000);
        }
        // localStorage.setItem("hive", (document.getElementById('hiveuser').value));
        // window.location.href = '/';
      }
    ); // broadcast.comment
  };

}

function upvote(permlink, author, percentage, id) {
  if (window.hive_keychain) {
    if (localStorage.getItem("hiveKeychainVerified") !== null) {

      hiveuser = localStorage.getItem("hiveKeychainVerified");
      percentage = percentage * 0.01;
      let weight = 10000 * percentage;
     // console.log('we made it: ');
      hive_keychain.requestVote(hiveuser, permlink, author, weight, function (response) {
     //   console.log(response);
        // todo:  change reaction color

        document.getElementById(id).style.color = "red";
      })

      // console.log(hiveuser + " connected");
    } else {
   //   console.log('keychain not setup, or something');
    };
  } else {
  //  console.log('keychain not installed');
  };
};


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

function share() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location
    }).then(() => {
    //  console.log('Thanks for sharing!');
    })
      .catch(console.error);
  } else {
    shareDialog.classList.add('is-open');
  }
};

function displayPost() {
  document.getElementById("display").style = "margin: auto; margin-top: .25em; margin-bottom: .25em; max-width: 800px; justify-content: center; padding:2em; background-color: whitesmoke; border: 1px solid grey; box-shadow: 1px 1px;"
  //  console.log('displaying post')
  var letting = getQueryVariable("post").split("/");
  let author = letting[0].replace("@", '');
  let permlink = letting[1];
  // console.log("letting : " + author + permlink);
  localStorage.setItem('replyAuthor', author);
  localStorage.setItem('replyLink', permlink);
  // console.log("this is a reply to " + result.parent_author)
  hive.api.getContent(author, permlink, function (err, result) {
    // console.log(result)


    if (result.parent_author.length > 1) {


      document.getElementById("display").innerHTML += "<div style='font-weight: strong; font-size: 200%; line-height: 100%; padding: .1em;'>replying to : <a href='/?post=" + result.parent_author + "/" + result.parent_permlink + "'>" + result.parent_author + "/" + result.parent_permlink + "</a></div>";
    } else {
      //  console.log("this is a top level comment");

    }
    let post1 = md.render(result.body).replace("\n", "");
    //post1 = post1.replace(new RegExp("<img ", 'g'), "<img width='80%' ");
    let whenagain = new Date(result.created.slice(0, 10)).toDateString();
    whenagain = whenagain.split('GMT');
    let timeToRead = words(result.body) / 3 / 60;
    if (timeToRead < 1) {
      timeToRead = 1;
    }
    document.title = result.title + " by " + result.author;
    document.getElementById("display").innerHTML += "<div style='font-weight: strong; font-size: 200%; line-height: 100%; padding: .1em;'>" + result.title + "</div>";
    document.getElementById("display").innerHTML += "<br /><a href='/?hive=" + result.author + "' style='text-decoration: none'><button class='mdl-button mdl-js-button mdl-button--fab'><img src='https://images.hive.blog/u/" + result.author + "/avatar'></button> <h4 style='display: inline;'>" + result.author + "</a></h3><br />" + whenagain;

    document.getElementById("display").innerHTML += "<div style='float: right; text-align: right; justify-content: right; padding-top: 2em;'> Reading time: " + timeToRead.toFixed(0) + " min </div></div>";


    document.getElementById("display").innerHTML += "<hr style='clear:both' />";
    let sanipost = md.render(post1);
    sanipost = sanitize(sanipost);
    sanipost = sanipost.replace(/@[A-Za-z0-9_.-]+[A-Za-z0-9_.]\s/gi, `<a href="/?hive=$&">$&</a>`);
    // sanipost = sanipost.replace('<a href="/?hive= ', `<a href="/?hive=`);






    document.getElementById("display").innerHTML += sanipost;
    // console.log("SANITATION TEST post output" + sanipost);
    document.getElementById("display").innerHTML += "<div id='commentTags' style='border-top: 1px solid'>Topics:  </div>";
    let jsonTAGS = JSON.parse(result.json_metadata);
    //console.log("jsonTAGS" + JSON.stringify(jsonTAGS));
    if (jsonTAGS.tags === undefined) {
      document.getElementById("commentTags").style.display = "none";
    } else {
      jsonTAGS.tags.forEach(genChips);
    }

    // TODO : color reaction 
    let percentage = "13"
    document.getElementById("display").innerHTML += "<hr /><span style='font-size:1em'>Acknowledge </span> <span class='material-icons' style='font-size:1em' onClick='upvote(`" + permlink + "`,`" + author + "`,`" + percentage + "`,`thumbs`)' id='thumbs'>thumb_up</span> ";
    let findVoter = JSON.stringify(result.active_votes);
    // console.log(findVoter);
    if (findVoter.search(localStorage.getItem("hive")) > 0) {
      // console.log("user found, you have upvoted this");
      document.getElementById("thumbs").style.color = "red";
    } else {
      //  console.log('you have yet to upvote this post')
    }

    // todo : commentsz
    document.getElementById("comments").innerHTML += `<h4>Comments</h4> `;
    hive.api.getContentReplies(author, permlink, function (err, result) {

      if (result.length > 0) {

        for (var i = 0; i < result.length; i++) {
          let thisPost = JSON.parse(JSON.stringify(result[i]));

          let sanicomm = md.render(md.render(result[i].body));
          sanicomm = sanicomm.replace(/@[A-Za-z0-9_.]\w+[A-Za-z0-9_.]\b/gi, "<a href='/?hive=$&'>$&</a>");

          // console.log(sanicomm);
          sanicomm = sanitize(sanicomm);
          document.getElementById("comments").innerHTML += "<div id='comm' style='overflow-wrap: break-word;'>  <a class='mdl-chip mdl-color--blue-grey mdl-chip--contact mdl-chip--deletable' href='/?hive=" + thisPost.author + "'><img class='mdl-chip__contact mdl-color--light-blue' src='https://images.hive.blog/u/" + thisPost.author + "/avatar' alt='avatar'></img><span class='mdl-chip__text' style='font-weight: bold; color: white'>" + thisPost.author + " &nbsp;</span></a>  <div style='padding:2em'>" + sanicomm + "</div> <div style='text-align: right'><a href='?post=@" + thisPost.author + "/" + thisPost.permlink + "'>permlink & replies</a></div></div>";

        }


      } else {

        document.getElementById("comments").innerHTML += "no comments to show<div style='padding: 5px; margin-bottom: 75px;'>&nbsp;</div>";

      }

    });

  });
}





function nonBlokzUser(hiveuser) {


  if (localStorage.getItem("hive") != undefined) {
    // to thy own self be true

    let entryy = localStorage.getItem("hive");
    entryy = entryy.toLowerCase();
    // CURRENT TODO: FRIEND IMAGE
  //  console.log("CAUGHT: " + entryy);
    var favfriend = document.createElement("div");
    favfriend.id = "whoamiaa";
    favfriend.setAttribute("onclick", "window.location.href='./?hive=" + entryy + "';");
    favfriend.style = "display: inline-block; padding: 5px; margin: 10px auto;width: 100px;  text-align: center"
    document.getElementById("favorites").appendChild(favfriend);
    var para = document.createElement("div");                 // Create a <p> element
    para.id = favfriend.id + "sub";
    var ffs = document.createElement("div");
    ffs.id = favfriend.id;
    var ffsName = document.createElement("div");
    ffsName.id = favfriend.id + "ffsName";
    var ff = favfriend.id + "NEW";   // placeholder
    document.getElementById(favfriend.id).appendChild(para);
    document.getElementById(ffs.id).appendChild(ffsName);
    var image = document.createElement("img");
    var imageParent = document.getElementById(para.id);
    image.className = "avatar";
    image.src = "https://images.hive.blog/u/" + entryy + "/avatar";            // image.src = "IMAGE URL/PATH"
    imageParent.appendChild(image);
    document.getElementById(favfriend.id).appendChild(ffsName);
    ffsName.innerHTML = "<small id='" + ff + "'>" + entryy + "</small>";
  }

  // LOAD GENERIC posting_json_metadata for non blokz/profile user
  // console.log("user does not exist! or something went wrong")
  document.title = hiveuser + "'s personal.community profile";

  hive.api.call('database_api.find_accounts', { accounts: [hiveuser] }, (err, res) => {
    let createdAge = res.accounts[0].created.slice(0, 10);
    let datedd = createdAge.split("-");
   // console.log("Member since: " + datedd[0]);
    function monthName(mon) {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon - 1];
    }
    document.getElementById("age").innerHTML = monthName(datedd[1]) + " " + datedd[2] + ", " + datedd[0];
    if (res.accounts[0].posting_json_metadata.length > 1) {
      let posting_json = JSON.parse(JSON.stringify(res.accounts[0].posting_json_metadata));
      // console.log("posting_json: " + posting_json);



      document.getElementById("profimg").src = "https://images.hive.blog/u/" + hiveuser + "/avatar";



      if (JSON.parse(posting_json).profile.cover_image !== undefined) {
        if (JSON.parse(posting_json).profile.cover_image.length > 4) {
          document.getElementById("coverimage").style.backgroundImage = "url('https://images.hive.blog/0x0/" + JSON.parse(posting_json).profile.cover_image + "')";
        }
      }

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
    } else {


      document.getElementById("strongWebsite").style.display = "none";

      document.getElementById("strongLocation").style.display = "none";

    }

    // document.getElementById("toptab").style.display = "none";
    //document.getElementById("strongLocation").style.display = "none";
    document.getElementById("strongAbout").style.display = "none";
    //document.getElementById("location").style.display = "none";
    document.getElementById("comments").style.display = "none";
    document.getElementById("nonuser").innerHTML = "<h3> no personal.community page setup</h3>";
    document.getElementById("nonuser").style.textAlign = "center"
    document.getElementById("usertitle").innerHTML = titleset;
    // document.getElementById("name").innerHTML = hiveuser;
    document.getElementById("strongInterests").style.display = "none";
    // document.getElementById("strongAge").style.display = "none";
    document.getElementById("fltrt").style.display = "none";


    //// console.log("Location: " +JSON.parse(posting_json).profile.location);

  });
  // finished displaying posting_json_metadata for non blokz/profile user

}




function splash() {
  document.body.style.backgroundImage = "url('/images/background.webp')";
  // console.log("splash engaged");
  var html = `<div id='splash'><h3 style="margin: 2px; padding: 2px;">personal.community</h3><img src="/images/logo192.png"><br />` +
    `<h6 style="margin: 2px; padding: 2px;"><a class='mdl-button mdl-chip--contact mdl-chip--deletable' href='https://hive.io'><img class='mdl-chip__contact mdl-color--black' src='/images/hive.png' alt='hive.io'></img><span class='mdl-chip__text' style="font-weight: bold; color: #212529; font-family: 'Work Sans', sans-serif;">hive powered &nbsp;</span></a> </h6>` +
    //`    </div>` + test
    `<hr />To get started, hit the <img src="/images/favicon.png" style="height:16px" /> icon down below.` +
    `<br /> This is used to navigate personal.community past this page<br /> ` +
    `<hr />Made with &#10084; by <br /><a class='mdl-chip mdl-chip--contact mdl-chip--deletable' href='/?hive=sn0n'><img class='mdl-chip__contact mdl-color--pink' src='/images/sn0n.jpeg'></img><span class='mdl-chip__text'>sn0n &nbsp;</span></a></div>`;
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



function buildprofile(hiveuser) {




  let profile = document.getElementById('TempProfile');
  let display = document.getElementById('profile');
  display.appendChild(profile.content.cloneNode(true));
  //console.log("fetching profile for : " + hiveuser)
  // gets posting_json_metadata for generic profile data for user
  hive.api.call('database_api.find_accounts', { accounts: [hiveuser] }, (err, res) => {
    if (res.accounts[0].posting_json_metadata.length > 1) {
      let posting_json = JSON.parse(JSON.stringify(res.accounts[0].posting_json_metadata));
      // console.log("posting_json: " + posting_json);
      if (JSON.parse(posting_json).profile.about !== undefined) {
        let saniabo = JSON.parse(posting_json).profile.about;
        let saniabout = sanitize(saniabo);
        document.getElementById("usertitle").innerHTML = saniabout;
      } else {
        titleset = "";
      }
      if (JSON.parse(posting_json).profile.name !== undefined) {
        let saniname = JSON.parse(posting_json).profile.name;
        let saniName1 = sanitize(saniname);
        document.getElementById("name").innerHTML = saniName1;
      } else {
        document.getElementById("name").innerHTML = hiveuser;
      }
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
        //  console.log("loc " + sanilocation)
        document.getElementById("location").innerHTML = sanilocation;
      } else {
        document.getElementById("strongLocation").style.display = "none";
      }

      let createdAge = res.accounts[0].created.slice(0, 10);
      let datedd = createdAge.split("-");
      //console.log("Member since: " + datedd[0]);
      function monthName(mon) {
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon - 1];
      }
      document.getElementById("age").innerHTML = monthName(datedd[1]) + " " + datedd[2] + ", " + datedd[0];
      // TODO: -- remove testing notes ^>^
      // console.log("posting_json: " + posting_json);
      // display avater
      // https://images.hive.blog/u/" + result.author + "/avatar
      let useravatar = "https://images.hive.blog/u/" + hiveuser + "/avatar";
      document.getElementById("profimg").src = useravatar;
      // display cover image


      if (JSON.parse(posting_json).profile.cover_image !== undefined) {
        if (JSON.parse(posting_json).profile.cover_image.length > 4) {
          document.getElementById("coverimage").style.backgroundImage = "url('https://images.hive.blog/0x0/" + JSON.parse(posting_json).profile.cover_image + "')";
        }
      }

    }
  });


  hive.api.getDiscussionsByAuthorBeforeDate(hiveuser, null, now, 20, (err, result) => {
    // testing for loop for posts. 
    // data for each post in a loop
    //document.getElementById("blog").innerHTML += "most recent posts of <h1><a href='/?hive=" + hiveuser + "'>" + hiveuser + "</a></h1>";
    for (var i = 0; i < result.length; i++) {

      // testing for replies 
      // console.log(" for loop data : " + JSON.stringify(result[i]));
      // console.log("who dis " + hiveuser);
      // console.log("i is " + i);
      // http://127.0.0.1:3000/?post=yabapmatt/some-thoughts-on-the-future
      reactionCount = result[i].active_votes.length;
      // console.log('post created on : ' + result[i].created);
      let postedon = new Date(result[i].created.slice(0, 10)).toDateString();
      let descjson = JSON.parse(result[i].json_metadata);
      //console.log("working with json_metadata: " + JSON.stringify(descjson));




      if (descjson.description !== undefined) {
        // console.log("success on description : " + descjson.description);
        postdesc = descjson.description;
      } else {
        // console.log("no desc");
        postdesc = md.render(result[i].body);
        postdesc = strip(postdesc);
        postdesc = sanitize(postdesc);
        postdesc = truncate(postdesc, 20);
        // console.log("What post desc we working with here: " + postdesc);
        postdesc = postdesc + "...";
      }
      postedon = postedon.split('GMT');

      let id = i

      // console.log(result[i].author + "/" + result[i].permlink)



      // TODO : color reaction 
      let percentage = "13"

      document.getElementById("blog").innerHTML += "<div style='max-width: 480px; margin: 1em; border: 1px solid grey; box-shadow: 1px 1px; text-align: left; padding-left: 1em;'><h4><a href='?post=" + hiveuser + "/" + result[i].permlink + "'>" + result[i].title + "</a></h4>" +
        "" + postedon + "<div style='overflow: hidden;'>" + postdesc + "</div>" +
        "<div style='margin-top: 1em; min-width: 50%; text-align: right; padding: .25em'><span style='font-size:1em'>Acknowledge </span> <span class='material-icons' style='font-size:1em; cursor: pointer;' onClick='upvote(`" + result[i].permlink + "`,`" + result[i].author + "`,`" + percentage + "`,`" + id + "`)' id='" + id + "'>thumb_up</span> " +
        "</div></div>";
      let findVoter = JSON.stringify(result[i].active_votes);
      // console.log(findVoter);
      if (findVoter.search(localStorage.getItem("hive")) > 0) {
        //  console.log("user found, you have upvoted this");
        document.getElementById(id).style.color = "red";
      } else {
        // console.log('you have yet to upvote this post')
      }
    }
  });


  // show link to peakd profile
  // TODO : remove link 
  document.getElementById("hiveuser").innerHTML = "<br /><a href='http://peakd.com/@" + hiveuser + "' target='_peakd'><img src='/images/peakd.png'></a> &#8226; ";
  document.getElementById("hiveuser").innerHTML += "<a href='http://hivestats.io/@" + hiveuser + "' target='_hivestats'><img src='/images/hivestats.ico'></a> &#8226; ";
  document.getElementById("hiveuser").innerHTML += "<a href='https://hive-engine.com/?p=balances&a=" + hiveuser + "' target='_hiveengine'><img src='/images/hive_engine.png' height='32px' width='32px'></a> &#8226; ";
  document.getElementById("hiveuser").innerHTML += "<a href='https://hiveblocks.com/@" + hiveuser + "' target='_hiveblocks'>hiveblocks</a>  &#8226;  ";
  document.getElementById("hiveuser").innerHTML += "<a href='https://hivel.ink/@" + hiveuser + "' target='_hivelink'>hivel.ink</a>";
  // https://hivel.ink/@sn0n
  // fetch blokzprofile post from hive
  hive.api.getContent(hiveuser, 'blokzprofile', function (err, result) {
    // hive.api.getDiscussionsByAuthorBeforeDate(hiveuser, 'blokzprofile', now, 1, (err, result) => {
    // user has a blokz/profile
    // console.log("whats goin on here?")
    // console.log(err, result)
    if (result.json_metadata !== undefined) {

      // console.log("meep :" + JSON.stringify(result));
      var blokzmeta = JSON.parse(result.json_metadata);
      // console.log("test " + blokzmeta.article);
      // console.log("what is blokify " + blokify);
      var bitff = JSON.parse(JSON.stringify(blokzmeta));
      // console.log("blokzmeta: " + bitff.app);
      // console.log(bitff.interests);
      document.getElementById("article").innerHTML = sanitize(md.render(blokzmeta.article));
      // ~~~ md.render(blokzmeta.article).replace("\n", "");
      //var profage = year.getFullYear() - sanitize(blokzmeta.birthyear);

      // document.getElementById("location").innerHTML = sanitize(blokzmeta.location);
      // document.getElementById("gender").innerHTML = sanitize(blokzmeta.gender);
      // document.getElementById("favsite").innerHTML = "<a href='" + sanitize(blokzmeta.favsite) + "' target='_blank'>" + sanitize(blokzmeta.favsite) + "</a>";
      // interests

      /* <a class='mdl-chip mdl-chip--contact mdl-chip--deletable' href='/?tag=hive-167922'>
      <img class='mdl-chip__contact mdl-color--pink' src='https://images.hive.blog/u/hive-167922/avatar'></img>
      <span class='mdl-chip__text'>leofinance &nbsp;</span>
      </a>  */

      var interests = sanitize(bitff.interests);
      let interestsLog = interests.split(',');

      interestsLog.forEach(function (entry) {
        // console.log(entry);
        if (entry.substring(0, 5) == "hive-") {
          // console.log("community found in interests at " + entry);
          var xhr = new XMLHttpRequest();
          xhr.open("POST", url);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              let communityinfo = JSON.parse(xhr.responseText)
              // console.log("at bat " + communityinfo.result.title);
              let originalchips = document.getElementById("interests").innerHTML;
              document.getElementById("interests").innerHTML = "<a class='mdl-chip mdl-chip--contact mdl-chip--deletable' href='/?tag=" + entry + "'><img class='mdl-chip__contact mdl-color--pink' src='https://images.hive.blog/u/" + entry + "/avatar'></img><span class='mdl-chip__text'>" + communityinfo.result.title + "&nbsp;</span></a>" + originalchips;
            }
          };
          var data = '{"jsonrpc":"2.0", "method":"bridge.get_community", "params":{"name":"' + entry + '","observer":"blokz"}, "id":1}';
          xhr.send(data);
        } else {
          if (entry.length > 2) {
            let entryy = entry.replace(/\s+/g, '');
            entryy = entryy.replace(/[^a-zA-Z0-9]/g, '');
            entryy = entryy.toLowerCase();
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
          }
        };

        // todo: community chips

        // end of fix community named chips


        // ENDNEW
      });

      // favorite steemians
      var favs = sanitize(bitff.favorites);



      if (localStorage.getItem("hive")) {
        // to thy own self be true
        // console.log("ok wtf m8" + localStorage.getItem("hive"))
        let entryy = localStorage.getItem("hive");
        entryy = entryy.toLowerCase();
        // CURRENT TODO: FRIEND IMAGE
        // console.log("CAUGHT: " + entryy);
        var favfriend = document.createElement("div");
        favfriend.id = "whoamiaa";
        favfriend.setAttribute("onclick", "window.location.href='./?hive=" + entryy + "';");
        favfriend.style = "display: inline-block; padding: 5px; margin: 10px auto;width: 100px;  text-align: center"
        document.getElementById("favorites").appendChild(favfriend);
        var para = document.createElement("div");                 // Create a <p> element
        para.id = favfriend.id + "sub";
        var ffs = document.createElement("div");
        ffs.id = favfriend.id;
        var ffsName = document.createElement("div");
        ffsName.id = favfriend.id + "ffsName";
        var ff = favfriend.id + "NEW";   // placeholder
        document.getElementById(favfriend.id).appendChild(para);
        document.getElementById(ffs.id).appendChild(ffsName);
        var image = document.createElement("img");
        var imageParent = document.getElementById(para.id);
        image.className = "avatar";
        image.src = "https://images.hive.blog/u/" + entryy + "/avatar";            // image.src = "IMAGE URL/PATH"
        imageParent.appendChild(image);
        document.getElementById(favfriend.id).appendChild(ffsName);
        ffsName.innerHTML = "<small id='" + ff + "'>" + entryy + "</small>";
      }

      // console.log("favs : " + favs);
      let favsLog = favs.split(',');

      favsLog.forEach(function (entry) {





        if (entry !== "sn0n") {
          if (entry.length > 2) {
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
          }
        }
      }); // finished displaying blokzprofile


    } else {
      nonBlokzUser(hiveuser);
    }
    hidecomm();
  });
  document.title = hiveuser + "'s personal.community profile";


  if (hiveuser == localStorage.getItem('hive')) {
    // begin operation: HUB
    //  console.log('this is the start of the main hub for browse as');
    let admin = document.getElementById('admin');
    let top8friends = document.getElementById('top8friends');
    document.getElementById('bio').style.display = "none";
    document.getElementById('admin').innerHTML = "<h1 style='border-bottom: 1px solid black'>The Hub</h1>";
    admin.appendChild(fltrt);
    admin.appendChild(top8friends);
    document.getElementById('admin').style = "padding-left: 2em; padding-right: 2em;"
    document.getElementById('top8friends').style = "width: 100%"
  }

}


// ?tag=(tag)
function showtag(tag) {
  hive.api.getDiscussionsByCreated({ "tag": tag, "limit": 20 }, function (err, result) {
    if (err === null) {
      var i, len = result.length;
      // console.log("what is a " + tag);

      if (tag.substring(0, 5) == "hive-") {
        //  console.log("community found in interests at " + tag);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            let communityinfo = JSON.parse(xhr.responseText)
            // console.log("at bat " + communityinfo.result.title);
            let contentofTag = document.getElementById("display").innerHTML;
            document.getElementById("display").innerHTML = "<small>most recent</small><div style='font-size: 2em; padding: .1em; margin: .2em'>" + communityinfo.result.title + " community posts</div><br />" + contentofTag;
          }
        };
        var data = '{"jsonrpc":"2.0", "method":"bridge.get_community", "params":{"name":"' + tag + '","observer":"blokz"}, "id":1}';
        xhr.send(data);
      } else {
        document.getElementById("display").innerHTML += "<small>most recent</small><div style='font-size: 3em; padding: .1em; margin: .2em'>#" + tag + " posts</div><br />";

      }

      for (i = 0; i < len; i++) {
        var discussion = result[i];
        // console.log(i, discussion);
        // console.log("who dun it " + discussion.author);
        // console.log("where do i find it? @" + discussion.author + "/" + discussion.permlink);
        let whenbytag = new Date(discussion.created.slice(0, 10)).toDateString();
        //whenbytag = whenbytag.split('GMT');
        //let reactioncount = result[i].active_votes.length;

        let descjson = JSON.parse(result[i].json_metadata);
        //console.log("working with json_metadata: " + descjson.description);

        if (descjson.description !== undefined) {
          //  console.log("success on description : " + descjson.description);
          postdesc = descjson.description;
        } else {
          // console.log("no desc");
          postdesc = md.render(result[i].body);
          postdesc = strip(postdesc);
          postdesc = sanitize(postdesc);
          postdesc = truncate(postdesc, 40);
          // console.log("What post desc we working with here: " + postdesc);
          postdesc = postdesc + "...";
        }
        let percentage = "13";
        let id = i;
        document.getElementById("display").innerHTML += "<div style='background-color: #fff;border: 1px solid grey; box-shadow: 1px 1px; padding: 1em; margin: 1em;'>" +
          "<div><div style='min-width:70%'>" +
          "<h4><a href='?post=" + discussion.author + "/" + result[i].permlink + "'>" + result[i].title + "</a></h4>" +

          "<a href='..?hive=" + discussion.author + "'><img src='https://images.hive.blog/u/" + discussion.author + "/avatar' width='32px' height='32px' style='-moz-border-radius:75px;-webkit-border-radius: 75px;'>" +
          " <span class='mdl-chip__text'> " + discussion.author +
          "</span></a></div>" +
          "<div style='justify-content: right; min-width: 30%;'> " + whenbytag + "</div>" +
          "<div style='overflow: hidden; padding-bottom: .5em; padding-left: 5em; padding-right: 5em; padding-top: 1em; '>" + postdesc + "</div>" +

          "</div>" +
          "<div style='margin-top: 1em; min-width: 50%; text-align: right; padding: .25em'><span style='font-size:1em'>Acknowledge </span> <span class='material-icons' style='font-size:1em; cursor: pointer;' onClick='upvote(`" + result[i].permlink + "`,`" + result[i].author + "`,`" + percentage + "`,`" + id + "`)' id='" + id + "'>thumb_up</span> " +
          "</div>";
        "</div>";

        // document.getElementById("display").innerHTML += "<a href='?post=@" + discussion.author + "/" + sanitize(discussion.permlink) + "'>" + sanitize(discussion.title) + "</a><br /> by " + discussion.author + " on " + whenbytag + " | <span class='material-icons' style='font-size:12px'>thumbs_up_down</span> " + reactioncount + "<hr />";
        document.getElementById("comments").style.display = "none";
      }
    } else {
      // console.log(err);
    }
  });
}


function blokzlock() {
  // close menu
  // blokzmenu();
  // console.log('nope');
  // create modal
  // stor localstorage key 
  // use aes

  var encrypted = AES256.encrypt('TEXT', 'PASSWORD');
  // console.log(encrypted);

  // close dialog
  // document.querySelector('dialog').close();

}




// MAIN()
window.onload = function loading() {



  if (getQueryVariable("newpost") !== false) {
    easyMDE = new EasyMDE({ element: document.getElementById('postBody'), minHeight: "55vh", maxHeight: "55vh" });
  } else if (window.location.pathname == "/profile_update/") {
    easyMDE = new EasyMDE({ element: document.getElementById('article') });
    updatePage()
  } else if (getQueryVariable("post") !== false && localStorage.getItem("hiveKeychainVerified")) {
    easyMDE = new EasyMDE({ element: document.getElementById('replyBody') });
    document.getElementById("somecontext").style.display = "block";
  } else {
    easyMDE = new EasyMDE({ element: document.getElementById('postBody') });
  }

  // 
  if (getQueryVariable("loginas") !== false) {
    if (localStorage.getItem("hive") === null) {
      let whois = getQueryVariable("loginas").toLowerCase()
      localStorage.setItem("hive", whois);
    }
    hiveuser = getQueryVariable("loginas").toLowerCase();
    if (window.hive_keychain) {
      let confirmAction = confirm("Use hive-Keychain?");
      if (confirmAction) {
        function keyChainPassing(keychainpass) {
          hive_keychain.requestHandshake(function () {
            //  console.log("Handshake received!");
          })
          hive_keychain.requestSignBuffer(keychainpass, 'Login', 'Posting',
            (response) => {
              // console.log(response)
              if (response.success) {
                // all is well!
                //   console.log("success;");
                localStorage.setItem("hiveKeychainVerified", hiveuser);
                window.location.href = "/"
              } else {
                //   console.log('that username didnt work bruh');
                localStorage.removeItem("hive");
                window.location.href = "/?failedlogin"
              };
            });
        };
        keyChainPassing(hiveuser);
        // console.log(hiveuser + " connected");
      } else {
        window.location.href = "/"
      }

    } else {
      //  console.log('keychain not installed');
      window.location.href = "/"
    };

  };


  // add hive - keychaing : localStorage.getItem("hiveKeychainVerified") 
  if (localStorage.getItem("hive") !== null) {
    let loggedinas = localStorage.getItem("hive");
    if (localStorage.getItem("hiveKeychainVerified") !== null) {
      document.getElementById("loggedin").innerHTML = "<div style='float: right'><button class='mdl-button mdl-js-button' onclick='logout()'><i class='material-icons'>exit_to_app</i><small>Logout</small></button></div> <div style='padding-top: 3px;'><a href='/?hive=" + loggedinas + "' style='text-decoration: none'><button class='mdl-button mdl-js-button mdl-button--fab'><img src='https://images.hive.blog/u/" + loggedinas + "/avatar'></button> " + loggedinas + "</a></div> ";
      document.getElementById("loggedin").innerHTML += "<br /><a href='/?newpost=true'>Write Post</a>";
      if (update !== true && localStorage.getItem("hive") !== null) {
        document.getElementById('showUpdate').innerHTML = "<a href='/profile_update/'>Update Profile</a>";
      }
      //  console.log('keychain verified exists')
    } else if (localStorage.getItem("verified") == 'true') {
      // console.log('logged in true')
      document.getElementById("loggedin").innerHTML = "<div style='float: right'><button class='mdl-button mdl-js-button' onclick='logout()'><i class='material-icons'>exit_to_app</i><small>Logout</small></button></div> <div style='padding-top: 3px;'><a href='/?hive=" + loggedinas + "' style='text-decoration: none'><button class='mdl-button mdl-js-button mdl-button--fab'><img src='https://images.hive.blog/u/" + loggedinas + "/avatar'></button> " + loggedinas + "</a><button class='mdl-button mdl-js-button' onclick='localStorage.removeItem(`verified`);location.reload()'><i class='material-icons'>verified_user</i><small style='color: green;'>verified</small></button></div> ";
      document.getElementById("loggedin").innerHTML += "<br /><a href='/?newpost=true'>Write Post</a>";
      if (update !== true && localStorage.getItem("hive") !== null) {
        document.getElementById('showUpdate').innerHTML = "<a href='/profile_update/'>Update Profile</a>";
      }
    } else {
      //    console.log('login or something')
      document.getElementById("loggedin").innerHTML = "<div style='float: right'><button class='mdl-button mdl-js-button' onclick='logout()'><i class='material-icons'>exit_to_app</i><small>Logout</small></button></div> <div style='padding-top: 3px;'><a href='/?hive=" + loggedinas + "' style='text-decoration: none'><button class='mdl-button mdl-js-button mdl-button--fab'><img src='https://images.hive.blog/u/" + loggedinas + "/avatar'></button> " + loggedinas + "</a><button class='mdl-button mdl-js-button' id='show-dialog' type='button' class='mdl-button'><i class='material-icons'>verified_user</i><small style='color: red;'>blokz lock</small></button></div> ";
      // document.getElementById("loggedin").innerHTML += "<br /><a href='/?newpost=true'>Write Post</a>";

      var dialog = document.querySelector('dialog');
      var showDialogButton = document.querySelector('#show-dialog');

      showDialogButton.addEventListener('click', function () {
        dialog.showModal();
      });
      dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
      });
      /* Or dialog.show(); to show the dialog without a backdrop. */

    }
  }



  if (tag !== "null") {
    showtag(tag);
  } else if (getQueryVariable("newpost") !== false) {
    // console.log("NEW POST");
    document.getElementById("newPostDiv").style.display = "block";
    document.getElementById("display").style.display = "none";
    document.getElementById("comments").style.display = "none";
    document.getElementById("share").style.display = "none";
    if (getQueryVariable("author") !== false) {
      parentAuthor = getQueryVariable("author");
      parentPermlink = getQueryVariable("permlink");
      console.log(parentAuthor + "/" + parentPermlink);
      document.getElementById("posttitleid").style.display = "none";
      document.getElementById('postTitle').value = "replying to " + parentAuthor + "/" + parentPermlink;
      document.getElementById("postorcomment").innerHTML = "commenting on " + parentAuthor + "/" + parentPermlink;
    }
    loadTags();
  } else if (post === "true") {
    // document.body.style.background = "#333 url(/images/back.png) no-repeat center center fixed";
    displayPost();
  } else if (hiveuser !== undefined && window.location.pathname != "/profile_update/") {
    // shouldnt trigger on profule_update 
    buildprofile(hiveuser)
  } else if (update === true) {
    updatePage();
  } else if (localStorage.getItem("hive") !== null) {
    buildprofile(localStorage.getItem("hive"));
  } else {
    splash();
    hidecomm();
  };




  /*
  genCommunityChip()
  function genCommunityChip() {
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
  }
  */

}
