import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
	token = `bearer ${newToken}`
}

const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}


const create = async newObject => {
	const config = {
		headers: {Authorization: token}
	}

	const response = await axios.post(baseUrl, newObject, config)
	return response.data
}

const update = async newObject => {
	const url = `/api/blogs/${newObject.id}`
	const response = await axios.put(url, newObject)
	return response.data
}

const comment = async (blog, comment) => {
	const url = `/api/blogs/${blog.id}/comments`
	const response = await axios.post(url, {comment: comment})
	return response.data
}

const remove = async id => {
	const config = {
		headers: {Authorization: token}
	}

	await axios.delete(`/api/blogs/${id}`, config)
}

export default { getAll, setToken, create, update, remove, comment }