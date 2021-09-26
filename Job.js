class Job{
    constructor(title,url)
    {
        this.title = title;
        this.url = url;
    }

    get expression()
    {
        return new RegExp("\\b"+this.title.split(' ').join("\\b|\\b")+"\\b",'i'); 
    }
}

module.exports = Job;