const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let favorite = blogs[0]

  blogs.forEach((blog) => {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  })
  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = blogs.reduce((map, blog) => {
    map[blog.author] = (map[blog.author] || 0) + 1
    return map
  }, {})

  let topAuthor = null
  let maxBlogs = 0

  Object.entries(counts).forEach(([author, count]) => {
    if (count > maxBlogs) {
      topAuthor = author
      maxBlogs = count
    }
  })

  return {
    author: topAuthor,
    blogs: maxBlogs,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = blogs.reduce((map, blog) => {
    map[blog.author] = (map[blog.author] || 0) + (blog.likes || 0)
    return map
  }, {})

  let topAuthor = null
  let maxLikes = 0

  Object.entries(likesByAuthor).forEach(([author, likes]) => {
    if (likes > maxLikes) {
      topAuthor = author
      maxLikes = likes
    }
  })

  return {
    author: topAuthor,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
