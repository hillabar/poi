const express = require('express');
const app = express();
var DButilsAzure = require('./DButils');
//const bodyParser=require('body-parser');
app.use(express.json());

var jwt = require('jsonwebtoken');
const secret = "secret"; 

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});



//select all the users from db  
app.get("/bla2", (req, res) => {
    DButilsAzure.execQuery("SELECT * FROM users ")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
    console.log("Got GET Request");
});


//1) register
app.post('/register', function(req,res)
{
    DButilsAzure.execQuery("insert into users_table (userName,fName, lName, password ,city, country, email, category, questions) VALUES "+
    "('" + req.body.userName+"','" + req.body.fName+"','"+ req.body.lName + "','" + req.body.password + "','" + req.body.city + "','"+ 
    req.body.country + "','" + req.body.email + "','"+ req.body.category + "','"+ req.body.questions + "')" )
    .then(function(result){
        res.sendStatus(200);
        var category = req.body.category;
        DButilsAzure.execQuery("insert into userCategory (userName , category) VALUES " +
        "('" + req.body.userName + "','" + category + "')")
        .then(function(result){
            res.sendStatus(200);
        })
        .catch(function(err){
            res.send('err')
        })
    })
    .catch(function(err){
        res.send('The user is allready exists');
    })
});


//2) login
//--------------------------------------------
app.post('/login', function (req, res) {
    var username = req.body.userName;
    var password = req.body.password;
    DButilsAzure.execQuery("SELECT password FROM users_table WHERE userName = '" + username + "'")
        .then(function(result){
            
            // if (req.body.password == result[0].password) {
            //     var token = Token(username);
            //     res.send(token);
            // }
            // else{
            //    res.send("the password is wrong")
            // }

            var token = Token(username);
             res.send(token);
        })
        .catch(function(err){
            console.log(err);
            res.send("wrong user");
        })

});

function Token(user) {
    var payload = {userName: user,admin: false};
    var option={expiresIn: "1d"};
    var token = jwt.sign(payload,secret,option);
    return token;

}


// //3) 
//???????????
// app.post('/Restore_Password', function (req, res) {
//     var username = req.body.userName;
//     var question_id = req.body.question_ID;
//     var answer = req.body.answer;
//     DButilsAzure.execQuery("SELECT Answer FROM users_questions WHERE username = '" + username + "' AND question_ID = '" + question_id + "'")
//         .then(function (result) {
//             if (typeof result[0] !== 'undefined' && result[0] && answer == result[0].Answer) {
//                 //success
//                 DButilsAzure.execQuery("SELECT Password FROM Users WHERE Username = '" + username + "'")
//                     .then(function (result) {
//                         res.send(JSON.stringify(result[0]));
//                     })
//                     .catch(function (err) {
//                         console.log(err)
//                         res.send(err)
//                     })
//             }
//             else {
//                 //fail
//                 res.send("Wrong answer!");
//             }
//         })
//         .catch(function (err) {
//             console.log(err)
//             res.send(err)
//         })
// });


//4-getCountries
//add a new table for countries
app.post('/getCountries', function (req,res)
{
    DButilsAzure.execQuery("SELECT * FROM Countries ")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
    
});

//new 
app.get('/getCountry/:countryName', function (req, res){
    DButilsAzure.execQuery("select * from Countries where countryName ='" + req.params['countryName'] + "'")
    .then (function (result){
        res.send(result) 
    })
    .catch(function(err){
        res.send('there is no country')
    })
});



//5 
app.get('/getUser/:userName', function (req, res){
    DButilsAzure.execQuery("select * from users_table where userName ='" + req.params['userName'] + "'")
    .then (function (result){
        res.send(result) 
    })
    .catch(function(err){
        res.send('there is no point of interest with this rank')
    })
});



//enter rank and selects all point of interest who had the rank you enterd
//new func
app.get('/getPOI_rank/:rank', function (req, res){
    DButilsAzure.execQuery("select * from poiTable where rank ='" + req.params['rank'] + "'")
    .then (function (result){
        res.send(result) 
    })
    .catch(function(err){
        res.send('there is no point of interest with this rank')
    })
});


//random3
//6
app.get('/random3', function (req, res){
    DButilsAzure.execQuery("select * from poiTable where rank >= 3")
    .then ( function(result){
       let size = result.length ; 
       var random1 = Math.floor((Math.random() * size));
       if (size > 1){
           var random2 = Math.floor((Math.random() * size));
           while (random1 === random2){
               random2 = Math.floor((Math.random() * size));
           }
       }
       if (size>2){
           var random3 = Math.floor((Math.random() * size));
           while (random1 === random3 || random2 === random3){
               random3 = Math.floor((Math.random() * size));
           }
       }
       var random3POI = {
           poi1: result[random1],
           poi2: result[random2],
           poi3: result[random3]
       }
       res.send(random3POI);
   })
    .catch(function(err){
        res.send(err)
    })
});

//POIInfo
//7
app.get('/getPoi/:poiID', function (req, res){
    DButilsAzure.execQuery("select * from poiTable where poiID = '" + req.params['poiID'] + "'")
    .then (function (result){
        if(result.length>0)
        res.send(result);
        else
        res.send(result) 
    })
    .catch(function(err){
        res.send('there is no point of interest with this ID')
    })
});


//select all the categories from db  
//8
app.get("/getCategories", (req, res) => {
    DButilsAzure.execQuery("SELECT * FROM Categories ")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send('their is no Categories')
    })
});

//9
app.get ('/getPoiByCategory/:category', function (req, res){
    var ca=req.params['category'];
    DButilsAzure.execQuery("select * from poiTable where category = '" +ca+"'")
    .then (function (result){
        if(result[0].length!=0){
            for (var i = 0 ; i < result.length ; i++){
                res.send(result[i]);
            }
        } 
    })
    .catch(function(err){
        res.send('there is no point of interest with this category')
    })
 });



//11
app.get('/twofavePOI/:userName',function(req,res){
    var username=req.params['userName'];
    DButilsAzure.execQuery("SELECT category,name,description,rank, numberWatch FROM poiTable inner join userFavorite_Table on userFavorite_Table.userName = '"+  username + "' AND poiTable.poiID = userFavorite_Table.poiID ")
    .then(function(result){
        var thelast2POI = {
            poi1: result[result.length-1],
            poi2: result[result.length-2],
        }
        res.send(thelast2POI);
    })
    .catch(function(err){
        res.send(err);
    })
});

//12
app.get('/getTwoTopPoi',function(req,res){
    
    DButilsAzure.execQuery("SELECT MAX(rank) from poiTable where ")
    .then(function(result){
        DButilsAzure.execQuery("SELECT MAX(rank) as MAXrank from poiTable where rank not in (SELECT MAX(rank) from poiTable) ")
        .then(function(result2){
            var max ={
                poi1:result,
                poi2:result2,
            }
            res.send(max)      
        })
        .catch(function(err2){
            res.send(err2);
        })
    })
    .catch(function(err){
        res.send(err);
    })

});

app.use('/blatoken', function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    } 
    else {
        try{
            var decoded = jwt.verify(token, secret);
            req.decoded= decoded;
            next();
            
        }catch(exeption){
            res.status(400).send("invalid token");
        }
    }

});

//14
app.post('/savingFavPoi', function(req, res){
    
    var username =  req.body.userName;
    var poiID = req.body.poiID ; 
    var place = req.body.place;
    DButilsAzure.execQuery("insert into userFavorite_Table (userName, poiID , place) VALUES " + "('" +username + "','" + poiID + "'," +place +")")
    .then(function(result){
        res.send('you just added favorite place' );
    })
    .catch(function(err){
        res.send("error");
    })
});


//15
app.delete('/deleteFavPOI',function(req,res){
    var username = req.body.userName;
    var poiID = req.body.poiID ;
    DButilsAzure.execQuery("DELETE FROM userFavorite_Table WHERE userName='"+ username+"' AND poiID='" + poiID +"'")
    .then(function(result){
        res.send('point of interest deleted from your favorits');
    })
    .catch(function(err){
        res.send(err);
    })
});

//16
app.get('/counterNumOfFavorite/:userName',function(req,res){
    DButilsAzure.execQuery("select userName='"+ req.params['userName'] + "' ,count(userName) as numberFAV FROM userFavorite_Table where userName ='" + req.params['userName'] + "'")
    .then(function(result){
        res.send(result);
    })
    .catch(function(err){
        res.send(err);
    })
});

//17
app.post('/addReview', function (req, res, next) {
    var username =  req.body.userName;
    var poiID = req.body.poiID ; 
    var rank = req.body.rank;
    var review = req.body.review;
   

    if(!getPOI(poiID)){
        res.send("the input is wrong (poi)")
    }
    DButilsAzure.execQuery("insert into reviews (userName,review, poiID, rank) VALUES "+"('" + username+ "','" + review + "','"+ poiID + "','"+ rank + "')" )
    .then(function(result){
        res.send('you just added a review' );
    })
    .catch(function(err){
        res.send('The review is allready exists');
    })
        
});


//20
app.get("/allPoi", function(req, res){
    DButilsAzure.execQuery("SELECT * FROM poiTable ")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send('There is no point of interest')
    })
});




//21
app.get('/allPoiByUser/:userName', function (req, res){
    DButilsAzure.execQuery("select * from userFavorite_Table where userName ='" + req.params['userName'] + "'")
    .then (function (result){
        res.send(result) 
    })
    .catch(function(err){
        res.send('there is no point of interest with this rank')
    })
});

function getPOI(poi){
    DButilsAzure.execQuery("SELECT * FROM poiTable where poiID= '"+poi+"'")
    .then(function(result){
        return true;
    })
    .catch(function(err){
        return false;
    })
}

function CHECKUSER(username){
    DButilsAzure.execQuery("SELECT * FROM users_table where userName= '"+username+"'")
    .then(function(result){
        return true;
    })
    .catch(function(err){
        return false;
    })
}
