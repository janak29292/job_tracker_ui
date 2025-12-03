import { url } from '../utils/constants'
import Axios from 'axios'
// import { checkStatus, handleError } from './handler'

export default (payload, path, requestType, contentType, auth, params, id) => {
	console.log('apicaller', payload, path, requestType, contentType, auth, params, id)
	const authHeaders = auth ? {
		'Authorization' : 'Token '+ localStorage.token
	} : {}
	switch (requestType) {
		case 'post':
			return Axios.post(`${url}${path}`, payload, {
				headers: {
					'content-type': contentType,
					...authHeaders,
				},
				params
			}).then(res => res)
		case 'put':
			return Axios.put(`${url}${path}${id}/`, payload, {
				headers: {
					'content-type': contentType,
					...authHeaders,
				},
				params
			}).then(res => res)
		case 'patch':
			return Axios.patch(`${url}${path}${id}/`, payload, {
				headers: {
					'content-type': contentType,
					...authHeaders,
				},
				params
			}).then(res => res)
		case 'detail':
			return Axios.get(`${url}${path}${id}/`, {
				headers: {
					'content-type': contentType,
					...authHeaders,
				}
			}).then(res => res)
		case 'list':
		default:
			return Axios.get(`${url}${path}`, {
				headers: {
					'content-type': contentType,
					...authHeaders,
				},
				params: Object.fromEntries(
					Object.entries(params).map(([key, value]) => [
					key,
					Array.isArray(value) ? value.join(',') : value,
					])
				)
			}).then(res => res)
	}
}