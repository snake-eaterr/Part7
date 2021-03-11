const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	if(blogs.length === 0) {
		return 0
	}
	const likes = blogs.map(b => b.likes)
	const reducer = (accu, curr) => accu + curr
	return likes.reduce(reducer)
	
}

const favoriteBlog = (blogs) => {
	const likes = blogs.map(b => b.likes)
	const mostLikes = Math.max(...likes)
	const found = blogs.find(blog => blog.likes === mostLikes)
	
	return found

}

const mostBlogs = (blogs) => {
	const authors = blogs.map(b => b.author)
	let top = 0
	let authorName = ''
	for(let author of authors) {
		const authorBlogs = blogs.filter(blog => blog.author === author)
		if( authorBlogs.length <= top) {
			continue
		} else {
			top = authorBlogs.length
			authorName = author
		}
	}
	const objectToreturn = {author: authorName, blogs: top}
	return objectToreturn
}

const mostLikes = (blogs) => {
	let top = 0
	authorName = ''
	const authors = blogs.map(b => b.author)
	const likes = blogs.map(b => b.likes)
	for(let author of authors) {
		const authorBlogs = blogs.filter(b => b.author === author)
		const authorLikes = authorBlogs.map(b => b.likes)
		const sumOflikes = authorLikes.reduce((accu, curr) => accu + curr)
		if(sumOflikes > top) {
			top = sumOflikes
			authorName = author
		} 
	}

	const objectToReturn = {
		author: authorName,
		likes: top
	}
	return objectToReturn
}


module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}