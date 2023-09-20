class Message
{
    constructor (content, author, createDate)
    {
        this.content = content
        this.author = author
        this.createDate = createDate
    }
    edit(newContent)
    {
        this.content = newContent
    }
}
