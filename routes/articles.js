// this is the document where all the routes related to the article will be implemented 

const express = require('express')
const Article = require('./../models/article')
const router = express.Router() //declares a router handler that acts similarily as an app


//creating route for New article page
router.get('/new', (req,res) => {
    res.render('articles/new' , {article: new Article()}) //render a page which will be put into articles/new , also passing in an article and making it a new Article  
})
//route for Edit page 
router.get('/edit/:id', async (req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit' , {article: article}) //render a page which will be put into articles/new , also passing in an article and making it a new Article  
})
//every time we pass in route that has articles/something , if it is not new, route will go into here 
router.get('/:slug', async (req,res)=> {
    const article =  await Article.findOne ({ 
        slug : req.params.slug}) //return individual article by finding by the  slug based on request


    if (article == null) res.redirect('/') // if there is no article, redirect user back to homepage
    res.render('articles/show', {article : article}) //rendering out new page that will show user's articles 

})
//when user selects save button on New article page, this method will be called 
//save article to your data base 
router.post('/',  async (req,res,next) => {   
    req.article = new Article()//get article and save it to our request
    next() //telling code to move onto next function in the list
    
},saveArticleAndRedirect('new')) //passing in new path to function 

//put route  to update article based on its id
router.put('/:id',  async (req,res,next) => {   
    req.article = await Article.findById(req.params.id)//retreiving specfic article
    next() //telling code to move onto next function in the list
    
},saveArticleAndRedirect('edit')) //passing in new path to function

//used methodOverride to allow DELETE methods  
//creating a new route for deleting files 
router.delete('/:id', async (req,res) => {
    await Article.findByIdAndDelete(req.params.id)  //finding and deleting the paramaters id in reqeust
    res.redirect('/') // re directing user back to home page 
})

//takes in either path of edit or new and will render out a page based on user selection of new or edit article 
function saveArticleAndRedirect(path) {
    //common data between both paths 
    return async (req,res) => {  //article paramaters are initialized to create an article 
        let article = req.article
            article.title= req.body.title
            article.description= req.body.description
            article.markdown= req.body.markdown
        try {
           article = await article.save() // getting id for each article submission  
           res.redirect(`/articles/${article.slug}`) //re directing user to articles/slug route if all required paramaters are filled 
        } catch (e) {
            res.render(`articles/${path}`, { article: article }) // else will return back to articles/new route 
        }
    }
}




//export router so that application knows to use it 
module.exports = router