// setup all variables in the beginning of the doc
var count = 0;
// multiple line variable use backticks
var playgroun1 = `
    You clicked once, you won't see this again. ^>^
`;
// data variable is in demo.json 
//var mydata = JSON.parse(data);
var year = new Date();




// PLAYGROUND button            
function demo() {

    document.getElementById("playground").innerHTML = playgroun1;

    if (count > 0) {
        console.log(count);



        var db = new Nedb({
            filename: 'library.db',
            autoload: true
        });
        db.insert({ count: count }, function (err) {

        });
        db.find({ count: 1 }, function (err, docs) {
            document.getElementById("playground").innerHTML = "Visit " + docs.length + " and count: " + count;
        });

        count++;
    } else {
        console.log(count);

        count++;
    }
}




// stats logging
var db = new Nedb({ filename: 'db.json', autoload: true });

db.findOne({ _id: 1 }, function (err, doc) {
    doc = doc || { _id: 1, counter: 0 };

    console.log('This example was executed ' + doc.counter + ' times. Last access time was ' + doc.lastSeenAt);

    doc.lastSeenAt = new Date();
    doc.counter++;

    db.update({ _id: 1 }, doc, { upsert: true }, function (err, num) {
        console.log('Updated ' + num + ' records');
    });
});




