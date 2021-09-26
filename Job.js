class Job{
    constructor(title,url)
    {
        this.title = title;
        this.url = url;
        this.expression = new RegExp("\\b"+title.replace(/[^a-zA-Z]+/g,' ').split(' ').join("\\b|\\b")+"\\b",'i'); 
    }
}

module.exports = Job;