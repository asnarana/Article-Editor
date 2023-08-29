//declaring dependencies needed for code 
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article') //pulling in article model 
const methodOverride = require('method-override')
const articleRouter = require('./routes/articles') 
const app = express();

//connecting to database 
mongoose.connect('mongodb://127.0.0.1:27017/blog', {
    useNewUrlParser : true, useUnifiedTopology:true
})

//printing out html to screen 
app.set('view engine', 'ejs')

//calling render to access views folder and pass it the "index" path 
app.get('/',  async (req,res) => { 
    const articles = await Article.find().sort({
        createdAt: "desc"
    }) // returns an array of articles that user has submitted in past
    res.render('articles/index',{articles: articles})  // passing in an "articles" object to render and pass the object our articles
}) 

//allows accessibility to info coming forms  
app.use(express.urlencoded({extended : false}))
app.use(methodOverride('_method'))//informing app to use override and  pass it the string for what we are going to use
//informing app to utilize the article router at /articles path
app.use('/articles',articleRouter)

//starting up application on port 5000
app.listen(5000)