const year = new Date();
const now = new Date().toISOString().split('.')[0];

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
if (getQueryVariable("steem") !== false) {
    user = getQueryVariable("steem");
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

        } else {
            reject(err);
        }


    });
   
}


function updateProfile() {

// build profile data
var data = "A blokz profile, please click <a href='https://blokz.github.io/profile/?steem="+ document.getElementById('steemagent').value + "' target='_blank'>blokz.io/profile/?steem="+ document.getElementById('steemagent').value + "</a> to view.";
var article = document.getElementById('article').value;
var name =  document.getElementById('name').value;
var usertitle = document.getElementById('usertitle').value;
var birthyear = document.getElementById('birthyear').value;
var sign =  document.getElementById('sign').value;
var gender =  document.getElementById('gender').value;
var location = document.getElementById('location').value;
var interests =  document.getElementById('interests').value;
var favorites =  document.getElementById('favorites').value;
console.log("proof: " + article + name + usertitle + birthyear + sign + gender + location + interests + favorites);

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
        { tags: ['blokz'],
         app: 'blokz',
          article: article,
           name: name, 
           usertitle: usertitle,
           birthyear: birthyear,
           sign: sign,
           gender: gender,
           location: location,
           interests: interests,
           favorites: favorites },
        function (err, result) {
            if(err)
                alert('failure ' + err);
            else
                alert('Profile Updated');
        }
    );
}






window.onload = function loading() {



        // EXECUTE FOR STEEM
        
        
if (typeof user !== 'undefined') {

    
    steem.api.getAccounts([user], function(err, result) {
        console.log(err, result); 
        profdata = JSON.parse(result[0].json_metadata);
        console.log(profdata);
        console.log(profdata.profile.cover_image);
        console.log("TEST :" + profdata.profile.profile_image);
        var x = document.createElement("IMG");
        document.getElementById("profimg").src = "https://steemitimages.com/u/" + user + "/avatar"; //profdata.profile.profile_image;
    });

    document.getElementById("steemagent").innerHTML = "<a href='http://steempeak.com/@"+ user +"' target='_blank'>@" + user + "</a>";


        steem.api.getDiscussionsByAuthorBeforeDate(user, 'blokzprofile', now, 1, (err, result) => {

 
            
            if (result.length >= 1){
            console.log("fuck :" +result)   
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
                                                vadd.setAttribute("onclick","window.open('https://steempeak.com/created/" + entryy + "','_blank');");
                                                document.getElementById("interests").appendChild(vadd);
                                                var sadd = document.createElement('span');
                                                sadd.className = "mdl-chip__text";
                                                sadd.id = entryy + "2";
                                                document.getElementById(entryy).appendChild(sadd);
                                                
                                                var t = document.createTextNode(entryy); 
                                                document.getElementById(entryy + "2").appendChild(t);
                                                // ENDNEW

                    });


                // favorites
                var favs = bitff.favorites;
                    favsLog = favs.split(',');
                    favsLog.forEach(function (entry) {
                        console.log(entry);
                        entryy = entry.replace(/\s+/g, '');
                        entryy = entryy.toLowerCase();

                        // NEW
                        var vadd = document.createElement('button');
                        vadd.className = "mdl-chip";
                        vadd.id = entryy + "_1";
                        vadd.setAttribute("onclick","window.location.href='./?steem=" + entryy + "';");
                        document.getElementById("favorites").appendChild(vadd);
                        var sadd = document.createElement('span');
                        sadd.className = "mdl-chip__text";
                        sadd.id = entryy + "1";
                        document.getElementById(entryy + "_1").appendChild(sadd);
                        
                        var t = document.createTextNode(entryy); 
                        document.getElementById(entryy + "1").appendChild(t);
                        // ENDNEW
                    });



              
 


                // steem js bits
            } else {

                console.log("user does not exist! or something went wrong")
                document.getElementById("profilecardmini").style.display = "none";
                var para = document.createElement("div");                 // Create a <p> element
                para.innerHTML = "This user is not yet on blokz/profile";                // Insert text
                document.getElementById("bio").appendChild(para);     // Append <p> to <div> with id="myDIV"                

                var vadd = document.createElement('button');
                vadd.className = "mdl-chip";
                vadd.id = "back1";
                vadd.setAttribute("onclick","window.history.back();");
                document.getElementById("bio").appendChild(vadd);
                var sadd = document.createElement('span');
                sadd.className = "mdl-chip__text";
                sadd.id = "back2";
                document.getElementById("back1").appendChild(sadd);
                
                var t = document.createTextNode("back"); 
                document.getElementById("back2").appendChild(t);
            }


        });
    } else {
        console.log("IT WORKS!! user not set");
        document.getElementById("profilecard").style.display = "none";
    }
    



};


















// Profile WIZARD controls
 
var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("slider");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Post";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("slider");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    console.log("FORM SUBMITTED");
    updateProfile();
    document.getElementById("subbie").style.display = "none";
    document.getElementById("profileEdit").innerHTML = "Profile Update Submitted!";
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("slider");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}






console.log("steem.js loaded");