//model that will store articles

//marked slugify allowed me to create markdown and turn it into html and slugify allows to convert title, header, etc names into url
// friendly slug which we can use instead of a lengthy id code 
const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
//const createDomPurify = require('dompurify')
//const { JSDOM } = require('jsdom')
//const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({ //passing set of options for all of the columns an article has
    //each key defines a property in each article that will be casted to its associated SchemaType
    title: {
        type: String,
        required: true // always require the title 
    },
    description: {
        type: String 
    },
    markdown: {
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now //passing function and calling this function when user creates new record
    },
    slug: {
        type : String,
        required: true,
        unique : true
    }
    //sanitizedHtml: {
        //type: String,
        //required: true
    //}
})

//setting before Attributes and validations  to automically calc the slug when saving an article 
// running a function ran to the pre shortly before doing validation on our article 
articleSchema.pre('validate', function(next){
    if (this.title) {
        this.slug = slugify(this.title, {lower : true,  // setting up slug equal to slugify of title with few options/ exceptions 
        strict: true })
    }
    //if (this.markdown) {
        //this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
     // }
      
    next() // calling this to prevent errors with validation  
})
//creating collection  
module.exports = mongoose.model('Article', articleSchema) // passing in name of model and pass it in our schema 