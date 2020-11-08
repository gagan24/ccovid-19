require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const NewsAPI = require("newsapi");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

app.get("/", function(req, res){
    https.get("https://api.covid19api.com/world/total", function(response){
        console.log(response.statusCode)
        if (response.statusCode == 200){
        response.on("data", (data) => {
            console.log(JSON.parse(data))
            const result = JSON.parse(data);
            const confirmedCases = result.TotalConfirmed;
            const totalDeaths = result.TotalDeaths;
            const recovered = result.TotalRecovered;
            res.render("index", {confirmedCases: confirmedCases,
                activeCases: confirmedCases,
                totalDeaths: totalDeaths,
                recovered: recovered,
            });
            
        })
    }
    else{
        res.send("Error")
    }
    })
})

app.get("/news", function(req, res){
    const newsapi = new NewsAPI("7f2b060629b4473d96fd4d6ee7d88144");
    newsapi.v2.topHeadlines({
        q: 'covid-19',
        category: 'health',
        language: 'en',
        country: 'in'
      }).then(response => {  
        var title = [];
        var description = [];
        var detailsLink = [];
        for(i = 0; i < 10; i++){
            title.push(response.articles[i].title);
            description.push(response.articles[i].description)
            detailsLink.push(response.articles[i].url);
    }
      res.render("news", {title : title,
        description: description,
        detailsLink: detailsLink
    })
    })
})

app.listen(process.env.PORT ||3000, () => {
    console.log("runing on port 3000")
})

// https://corona.lmao.ninja/v2/all