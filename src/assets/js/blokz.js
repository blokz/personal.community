const year = new Date();
const now = new Date().toISOString().split('.')[0];

steem.api.setOptions({ url: 'https://anyx.io' });

// this checks for url variables like ?steem=sn0n
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

// 
if (localStorage.getItem("hive")!==null) {
user = localStorage.getItem("hive");
console.log(typeof user)
} else {
  console.log("user does not exist! or something went wrong");

}

if (getQueryVariable("steem") !== false) {
  user = getQueryVariable("steem");
  console.log(user + " connected");
}

if (getQueryVariable("hive") !== false) {
  user = getQueryVariable("hive");

localStorage.setItem("hive", user);
  console.log(user + " connected");
}



// search username on lookup
function steemagentUp() {
  console.log("TRIGGERED!!!");
  let steemagent = document.getElementById("steemagent").value;
  console.log(steemagent);
  steem.api.getDiscussionsByAuthorBeforeDate(steemagent, 'blokzprofile', now, 1, (err, result) => {

    // populate data
    if (result) {
      console.log("results are in:");
      console.log(result);
      var blokify = JSON.parse(JSON.stringify(result[0].body));
      var blokzmeta = JSON.parse((result[0].json_metadata));
      console.log(blokify);
      console.log("blokzmeta: " + blokzmeta);

      console.log(blokzmeta.blokz);

      var bitff = JSON.parse(JSON.stringify(blokzmeta));

      console.log(bitff);
      document.getElementById("name").value = bitff.name;
      document.getElementById("nameLabel").style.display = "none";
      document.getElementById("article").value = bitff.article;
      document.getElementById("articleLabel").style.display = "none";
      document.getElementById("usertitle").value = bitff.usertitle;
      document.getElementById("usertitleLabel").style.display = "none";
      document.getElementById("birthyear").value = bitff.birthyear;
      document.getElementById("birthyearLabel").style.display = "none";
      document.getElementById("sign").value = bitff.sign;
      document.getElementById("signLabel").style.display = "none";
      document.getElementById("location").value = bitff.location;
      document.getElementById("locationLabel").style.display = "none";
      document.getElementById("gender").value = bitff.gender;
      document.getElementById("genderLabel").style.display = "none";
      document.getElementById("interests").value = bitff.interests;
      document.getElementById("interestsLabel").style.display = "none";
      document.getElementById("favorites").value = bitff.favorites;
      document.getElementById("favoritesLabel").style.display = "none";
      document.getElementById("favsite").value = bitff.favsite;
      document.getElementById("favsiteLabel").style.display = "none";

    } else {
      reject(err);
    }


  });

}


function updateProfile() {

  // build profile data
  var data = "<img src='https://blokz.github.io/images/logo512.png'><br />A blokz profile, please click <a href='https://blokz.github.io/profile/?hive=" + document.getElementById('steemagent').value + "' target='_blank'>blokz.github.io/profile/?hive=" + document.getElementById('steemagent').value + "</a> to view.";
  var article = document.getElementById('article').value;
  var name = document.getElementById('name').value;
  var favsite = document.getElementById('favsite').value;
  var usertitle = document.getElementById('usertitle').value;
  var birthyear = document.getElementById('birthyear').value;
  var sign = document.getElementById('sign').value;
  var gender = document.getElementById('gender').value;
  var location = document.getElementById('location').value;
  var interests = document.getElementById('interests').value;
  var favorites = document.getElementById('favorites').value;
  console.log("proof: " + favsite + article + name + usertitle + birthyear + sign + gender + location + interests + favorites);

  // profile build finished





  steem.broadcast.comment(
    document.getElementById('postingKey').value,
    '', //author
    'blokzprofile', //firsttag
    document.getElementById('steemagent').value,
    'blokzprofile', //permlink
    'My Blokz Profile',
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
      sign: sign,
      gender: gender,
      location: location,
      interests: interests,
      favorites: favorites
    },
    function (err, result) {
      if (err)
        alert('failure ' + err);
      else
        alert('Profile Updated');
    }
  );
}




window.onload = function loading() {

  // EXECUTE FOR STEEM


  if (typeof user !== 'undefined') {


    steem.api.getAccounts([user], function (err, result) {
      console.log(err, result);
      profdata = JSON.parse(result[0].json_metadata);
      console.log(profdata);
      console.log(profdata.profile.cover_image);
      console.log("TEST :" + profdata.profile.profile_image);
      var x = document.createElement("IMG");
      document.getElementById("profimg").src = "https://steemitimages.com/u/" + user + "/avatar"; //profdata.profile.profile_image;
      document.getElementById("profilecard").style.backgroundImage = "url('https://steemitimages.com/0x0/" + profdata.profile.cover_image + "')";

    });

// get recent posts
steem.api.getDiscussionsByAuthorBeforeDate(user, null, now, 3, (err, result) => {
  var recent1 = JSON.parse(JSON.stringify(result[0]));
  console.log(recent1);
  var recent1date = recent1.created.slice(0, 10);
  document.getElementById("recent1").innerHTML = "1. <a href='http://peakd.com/@" + user + "/"+ recent1.permlink +"' target='_blank'>" + recent1.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent1date + "<br />";
  
  var recent2 = JSON.parse(JSON.stringify(result[1]));
console.log(recent2.permlink);

var recent2date = recent2.created.slice(0, 10);
document.getElementById("recent2").innerHTML = "2. <a href='http://peakd.com/@" + user + "/"+ recent2.permlink +"' target='_blank'>" + recent2.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent2date + "<br />";
   
var recent3 = JSON.parse(JSON.stringify(result[2]));
console.log(recent3.permlink);
var recent3date = recent3.created.slice(0, 10);

document.getElementById("recent3").innerHTML = "3. <a href='http://peakd.com/@" + user + "/"+ recent3.permlink +"' target='_blank'>" + recent3.title + "</a> <br /><span>&nbsp;</span>Posted on " + recent3date + "<br />";
document.getElementById("recentM").innerHTML = "<br /><div>View More on <a href='http://peakd.com/@" + user + "/' target='_blank'>peakd.com/@"+user+"</a></div><hr />";
   
});


document.getElementById("steemagent").innerHTML = "<a href='http://peakd.com/@" + user + "' target='_blank'>@" + user + "</a>";
steem.api.getDiscussionsByAuthorBeforeDate(user, 'blokzprofile', now, 1, (err, result) => {

      if (result.length >= 1) {
        console.log("meep :" + result);
        var blokify = JSON.parse(JSON.stringify(result[0].body));
        var blokzmeta = JSON.parse((result[0].json_metadata));
        console.log(blokify);
        var bitff = JSON.parse(JSON.stringify(blokzmeta));

        console.log("blokzmeta: " + bitff.app);
        console.log(bitff.interests);
        document.getElementById("name").innerHTML = bitff.name;
        document.getElementById("article").innerHTML = bitff.article;
        document.getElementById("usertitle").innerHTML = bitff.usertitle;
        var profage = year.getFullYear() - bitff.birthyear;
        document.getElementById("age").innerHTML = profage;
        document.getElementById("sign").innerHTML = bitff.sign;
        document.getElementById("location").innerHTML = bitff.location;
        document.getElementById("gender").innerHTML = bitff.gender;

        document.getElementById("favsite").innerHTML = "<a href='" + bitff.favsite + "' target='_blank'>" + bitff.favsite + "</a>";

        // interests
        var skills = bitff.interests;
        skillsLog = skills.split(',');
        skillsLog.forEach(function (entry) {
          console.log(entry);
          entryy = entry.replace(/\s+/g, '');
          entryy = entryy.replace(/[^a-zA-Z0-9]/g, '');
          entryy = entryy.toLowerCase();



          // NEW
          var vadd = document.createElement('button');
          vadd.className = "mdl-chip";
          vadd.id = entryy;
          vadd.setAttribute("onclick", "window.open('https://peakd.com/created/" + entryy + "','_blank');");
          document.getElementById("interests").appendChild(vadd);
          var sadd = document.createElement('span');
          sadd.className = "mdl-chip__text";
          sadd.id = entryy + "2";
          document.getElementById(entryy).appendChild(sadd);

          var t = document.createTextNode(entryy);
          document.getElementById(entryy + "2").appendChild(t);
          // ENDNEW

        });


        // favorite steemians
        var favs = bitff.favorites;
        favsLog = favs.split(',');
        favsLog.forEach(function (entry) {
          console.log("show: " + entry);
          entryy = entry.replace(/\s+/g, '');
          entryy = entryy.toLowerCase();
          // TEST TEST


          //  document.getElementById("profimg").src = "https://steemitimages.com/u/" + user + "/avatar"; //profdata.profile.profile_image;
          // CURRENT TODO: FRIEND IMAGE
          console.log("CAUGHT: " + entryy);


          // new template








          var favfriend = document.createElement("div"); 
          favfriend.id = entryy;
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

          document.getElementById(entryy).appendChild(para);   

          document.getElementById(ffs.id).appendChild(ffsName);

          var image = document.createElement("img");
          var imageParent = document.getElementById(para.id);
          //image.id = ff; 
          image.className = "avatar";
          image.src = "https://steemitimages.com/u/" + entryy + "/avatar";            // image.src = "IMAGE URL/PATH"


          imageParent.appendChild(image);


          document.getElementById(entryy).appendChild(ffsName);  
          ffsName.innerHTML = "<small id='"+ff+"'>"+entryy+"</small>"; 

          
            

          /*
          var vadd = document.createElement('button');
          vadd.className = "mdl-chip";
          vadd.id = "back1";
          vadd.setAttribute("onclick", "window.history.back();");
          document.getElementById("favorites").appendChild(vadd);
          var sadd = document.createElement('span');
          sadd.className = "mdl-chip__text";
          sadd.id = "back2";
          document.getElementById("back1").appendChild(sadd);

          var t = document.createTextNode("back");
          document.getElementById("back2").appendChild(t);
          
          // end new template
          // FRIEND CHIP

          var vadd = document.createElement('button');
          vadd.className = "mdl-chip";
          vadd.id = entryy + "_1";
          vadd.setAttribute("onclick", "window.location.href='./?steem=" + entryy + "';");
          document.getElementById("favorites").appendChild(vadd);
          var sadd = document.createElement('span');
          sadd.className = "mdl-chip__text";
          sadd.id = entryy + "1";
          document.getElementById(entryy + "_1").appendChild(sadd);

          var t = document.createTextNode(entryy);
          document.getElementById(entryy + "1").appendChild(t);
          // ENDNEW
          where = entryy + "1";
          document.getElementById(where).appendChild(document.createElement("div"));
          */
        });







        // steem js bits
      } else {

        console.log("user does not exist! or something went wrong")
        // document.getElementById("profilecardmini").style.display = "none";
        document.getElementById("strongLeft").style.display = "none";

        document.getElementById("strongFriends").style.display = "none";
        document.getElementById("strongWebsite").style.display = "none";
      }


    });
  } else {
    console.log("IT WORKS!! user not set");
    document.getElementById("gridd").style.display = "none";
  }




};

















console.log("localhost steem.js loaded");


function blokzmenu() {
  var x = document.getElementById("blokzmenu");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}