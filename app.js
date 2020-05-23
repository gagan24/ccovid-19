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
    https.get("https://covid-19india-api.herokuapp.com/v2.0/country_data", function(response){
        console.log(response.statusCode)

        response.on("data", (data) => {
            const result = JSON.parse(data);
            const details = result[1];
            const confirmedCases = details.confirmed_cases;
            const activeCases = details.active_cases;
            const totalDeaths = details.death_cases;
            const deathRate = details.death_rate;
            const recovered = details.recovered_cases;
            const recoveryRate = details.recovered_rate;
            const timeStamp = details.last_updated;
            const passengerScreened = details.passengers_screened;
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
                activeCases: activeCases,
                totalDeaths: totalDeaths,
                deathRate: deathRate,
                recovered: recovered,
                recoveryRate: recoveryRate,
                timeStamp: timeStamp,
                passengerScreened: passengerScreened
            });
        })
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
    const newsapi = new NewsAPI(process.env.API_KEY);
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
        for(i = 0; i < 5; i++){
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

