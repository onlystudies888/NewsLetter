const express = require('express');
const https = require("https");
const bodyParser = require('body-parser');
const request = require('request');
const { dirname } = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html')
})
app.post('/', function (req, res) {
    const fname = req.body.firstname
    const lname = req.body.lastname
    const email = req.body.email

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)
    
    const url = "https://us13.api.mailchimp.com/3.0/lists/0c3afc14d6"
    const options ={
        method: 'POST',
        auth: 'mail:45247fd78d151926a8a4abbcd97f7839-us13'
    }

    const request = https.request(url, options, function(response){
        
        if (response.statusCode  === 200){
            res.sendFile(__dirname+'/success.html')
        }else{
            res.sendFile(__dirname+'/failure.html')
            console.log(response.statusCode)
            
        }

        response.on('data',function(data){
            console.log(JSON.parse(data))
        })
    })
    request.write(jsonData)
    request.end();
})

app.post("/failure",function(req,res){
    res.redirect('/')
})





app.listen(process.env.PORT || 3000, function () {
    console.log("server running on port 3000")
})


//API KEY
//45247fd78d151926a8a4abbcd97f7839-us13
// 0c3afc14d6 LIST ID



