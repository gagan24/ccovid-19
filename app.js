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
            // const details = result[1];
            const confirmedCases = result.TotalConfirmed;
            // const activeCases = result.active;
            const totalDeaths = result.TotalDeaths;
            // const deathRate = details.death_rate;
            const recovered = result.TotalRecovered;
                // const tests = result.tests;
                // const todayConfirmed = result.todayCases;
                // const todayDeaths = result.todayDeaths;
                // const todayRecovered = result.todayRecovered;
            // const flag = result.countryInfo.flag;
                // const critical = result.critical;
            // const recoveryRate = details.recovered_rate;
            // const timeStamp = details.last_updated;
            // const passengerScreened = details.passengers_screened;
            
            // res.write("<p>" + timeStamp + "</p>");
            // res.write("<h1> Confirmed Cases " + confirmedCases + "</h1>");
            // res.write("<h1> Active cases " + activeCases + "</h1>");
            // res.write("<h1> Total Deaths " + totalDeaths + "</h1>");
            // res.write("<p> Death Rate" + deathRate + "</p>")
            // res.write("<h1> Total recovered " + recovered + "</h1>");
            // res.write("<p> Recovery Rate " + recoveryRate + "</p>")
            // res.write("<h1> Total Passenger Screened " + passengerScreened + "</h1>")
            // res.send();
            res.render("index", {confirmedCases: confirmedCases,
                activeCases: confirmedCases,
                totalDeaths: totalDeaths,
                // deathRate: deathRate,
                recovered: recovered,
                    // tests: tests,
                    // todayConfirmed: todayConfirmed,
                    // todayDeaths: todayDeaths,
                // todayRecovered: todayRecovered,
                    // critical: critical,
                // flag: flag
                // recoveryRate: recoveryRate,
                // timeStamp: timeStamp,
                // passengerScreened: passengerScreened
            });
            
        })
    }
    else{
        res.send("Error")
    }
    })
})

app.get("/news", function(req, res){
    // const url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=7f2b060629b4473d96fd4d6ee7d88144"

    // https.get(url, function(response){
    //     console.log(response.statusCode)
    //     response.on("data", (data) => {
    //         const news = data.toString();
    //         // res.send(JSON.parse(data));
    //         res.send(news.articles[0].title)
    //     })
    // })
    const newsapi = new NewsAPI("7f2b060629b4473d96fd4d6ee7d88144");
    newsapi.v2.topHeadlines({
        q: 'covid-19',
        category: 'health',
        language: 'en',
        country: 'in'
      }).then(response => {  
        //   for(i = 0; i < 5; i++){
        // res.write("<h1>" + response.articles[i].title + "</h1>");
        // res.write("<p>" + response.articles[i].description + "<p>");
        // res.write("<a href=" + response.articles[i].url + "<a><br>")
        //   }
        // res.send();
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