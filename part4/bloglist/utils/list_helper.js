const _ = require('lodash')

const totalLikes = blogs => {
    return blogs.map(v => v.likes).reduce((a, v) => a + v, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) return undefined

    let favorite = blogs.reduce((a, v) => a.likes >= v.likes ? a : v)

    if (blogs.length === 1) {
        favorite = blogs[0] 
    }

    return _.omit(favorite, ['_id', '__v', 'url'])
}

const mostBlogs = blogs => {
    const authorBlogCounts = _.countBy(blogs, o => o.author)
    const authors = _.values(_.mapValues(authorBlogCounts, (v, k) => {
        return {
            author: k,
            blogCount: v
        }
    }))
    return _.maxBy(authors, o => o.blogCount)
}

const mostLikes = blogs => {
    const blogsByAuthors = _.groupBy(blogs, o => o.author)
    const authors = _.values(_.mapValues(blogsByAuthors, (v, k) => {
        return {
            author: k,
            likes: _.sumBy(v, o => o.likes),
        } 
    }))
    return _.maxBy(authors, o => o.likes)
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
