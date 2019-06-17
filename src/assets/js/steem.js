const now = new Date().toISOString().split('.')[0];

// update profile 
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
 //end auto populate code

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
// set steem default user if not set
if (getQueryVariable("steem") !== false) {
    user = getQueryVariable("steem");
   // todo: fix this later
    //     document.getElementById("sitelabel").innerHTML = user + "'s steem profile ";
    console.log(user + " connected");   
} else {
    // this works. toggle for dev
    //user = "sn0n";
    //console.log(user);

}
// steem bit



window.onload = function loading() {



        // EXECUTE FOR STEEM
        
        
if (typeof user !== 'undefined') {

    steem.api.getAccounts([user], function(err, result) {
        console.log(err, result); 
        profdata = JSON.parse(result[0].json_metadata);
        console.log(profdata);
        console.log(profdata.profile.cover_image);
        console.log(profdata.profile.profile_image);
        var x = document.createElement("IMG");
        document.getElementById("profimg").src = profdata.profile.profile_image;
    });


        steem.api.getDiscussionsByAuthorBeforeDate(user, 'blokzprofile', now, 1, (err, result) => {

            
            if (result) {
                

                //for (var i = 0; i < blokzmeta.users.length; i++) {
                //    console.log("Friend " + i + " is @" + blokzmeta.users[i])
                //    id = "Friend" + i;
                //    document.getElementById(id).innerHTML = "<a href='http://steempeak.com/@" + blokzmeta.users[i] + "' target='_blank'>@" + blokzmeta.users[i] + "</a>";
               // }
                

                var blokify = JSON.parse(JSON.stringify(result[0].body));
                var blokzmeta = JSON.parse((result[0].json_metadata));
                console.log(blokify);
                console.log("blokzmeta: " + blokzmeta);
    

    
                var bitff = JSON.parse(JSON.stringify(blokzmeta));
                console.log(bitff.interests);
                document.getElementById("name").innerHTML = bitff.name;
                document.getElementById("article").innerHTML = bitff.article;
                document.getElementById("usertitle").innerHTML = bitff.usertitle;
                var profage = year.getFullYear() - bitff.birthyear;
                document.getElementById("age").innerHTML = profage; 
                document.getElementById("sign").innerHTML = bitff.sign;
                document.getElementById("location").innerHTML = bitff.location;
                document.getElementById("gender").innerHTML = bitff.gender;
                document.getElementById("steemagent").innerHTML = "<a href='http://steempeak.com/@"+ user +"' target='_blank'>@" + user + "</a>";

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
                        entryy = entryy.replace(/[^a-zA-Z0-9]/g, '');
                        entryy = entryy.toLowerCase();

                        // NEW
                        var vadd = document.createElement('button');
                        vadd.className = "mdl-chip";
                        vadd.id = entryy + "_1";
                        vadd.setAttribute("onclick","window.open('https://steempeak.com/@" + entryy + "','_blank');");
                        document.getElementById("favorites").appendChild(vadd);
                        var sadd = document.createElement('span');
                        sadd.className = "mdl-chip__text";
                        sadd.id = entryy + "1";
                        document.getElementById(entryy + "_1").appendChild(sadd);
                        
                        var t = document.createTextNode(entryy); 
                        document.getElementById(entryy + "1").appendChild(t);
                        // ENDNEW
                    });



              
                //var a = document.createElement('a');
                //var linkText = document.createTextNode(entry);
                //a.appendChild(linkText);
                //a.title = entry;
                //a.href = "http://steemit.com/trending/"+entry;
                //document.getElementById("skills").appendChild(a);



                //document.getElementById("skills").innerHTML = blokify[0].skills;
                //document.getElementById("biofull").innerHTML = blokify[0].biofull;

             


                // start friends section
                /* if (blokify[1] !== undefined) {
                    document.getElementById("Friend1").innerHTML = "<a href='http://steemit.com/" + blokify[1].Friend1 + "' target='_blank'>" + blokify[1].Friend1 + "</a>";
                    document.getElementById("Friend2").innerHTML = "<a href='http://steemit.com/" + blokify[1].Friend2 + "' target='_blank'>" + blokify[1].Friend2 + "</a>";
                    document.getElementById("Friend3").innerHTML = "<a href='http://steemit.com/" + blokify[1].Friend3 + "' target='_blank'>" + blokify[1].Friend3 + "</a>";
                    document.getElementById("Friend4").innerHTML = "<a href='http://steemit.com/" + blokify[1].Friend4 + "' target='_blank'>" + blokify[1].Friend4 + "</a>";
                    document.getElementById("Friend5").innerHTML = "<a href='http://steemit.com/" + blokify[1].Friend5 + "' target='_blank'>" + blokify[1].Friend5 + "</a>";
                    document.getElementById("Friend6").innerHTML = "<a href='http://steemit.com/" + blokify[1].Friend6 + "' target='_blank'>" + blokify[1].Friend6 + "</a>";
                    document.getElementById("Friend7").innerHTML = "<a href='http://steemit.com/" + blokify[1].Friend7 + "' target='_blank'>" + blokify[1].Friend7 + "</a>";
                    document.getElementById("Friend8").innerHTML = "<a href='http://steemit.com/" + blokify[1].Friend8 + "' target='_blank'>" + blokify[1].Friend8 + "</a>";
                } else {
                    console.log("no friends") 
                } */



                // steem js bits
            } else {
                reject(err);
            }


        });
    } else {
        console.log("IT WORKS!! user not set");
        document.getElementById("profilecard").style.display = "none";
    }
    
    // end steem bits

    var i;
    for (i = 0; i < 8; i++) {
        console.log('i = ' + (i + 1));
    }

    // if (getQueryVariable("id") !== false) {
    //    document.getElementById("external").innerHTML = getQueryVariable("id");
        // todo: ID tags
  //  } else {
  //      document.getElementById("external").innerHTML = "none";
  //  }
   
    //loading end
};



console.log("steem.js loaded");