import React from 'react'
import { Link } from 'react-router-dom'


const Blogs = ({ blog}) => {

	

	return (
		<div>
			<Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
		</div>
	)

}
export default Blogs
