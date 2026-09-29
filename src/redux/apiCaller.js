import { url } from '../utils/constants'
import Axios from 'axios'
// import { checkStatus, handleError } from './handler'

export default (payload, path, requestType, contentType, auth, params = {}, id) => {
	console.log('apicaller', payload, path, requestType, contentType, auth, params, id)
	const authHeaders = auth ? {
		'Authorization': 'Token ' + localStorage.token
	} : {}
	let finalHeaders = {
		'content-type': contentType,
		...authHeaders,
	};
	if (payload instanceof FormData) {
		delete finalHeaders['content-type'];
	}

	let endpointUrl = `${url}${path}`;
	if (id !== undefined && id !== null) {
		if (endpointUrl.includes(':id')) {
			endpointUrl = endpointUrl.replace(':id', id);
		} else if (['put', 'patch', 'detail', 'delete'].includes(requestType)) {
			endpointUrl = `${endpointUrl}${id}/`;
		}
	}

	switch (requestType) {
		case 'post':
			return Axios.post(endpointUrl, payload, {
				headers: finalHeaders,
				params
			}).then(res => res)
		case 'put':
			return Axios.put(endpointUrl, payload, {
				headers: finalHeaders,
				params
			}).then(res => res)
		case 'patch':
			return Axios.patch(endpointUrl, payload, {
				headers: finalHeaders,
				params
			}).then(res => res)
		case 'detail':
			return Axios.get(endpointUrl, {
				headers: finalHeaders
			}).then(res => res)
		case 'delete':
			return Axios.delete(endpointUrl, {
				headers: finalHeaders
			}).then(res => res)
		case 'list':
		default:
			return Axios.get(endpointUrl, {
				headers: finalHeaders,
				params: Object.fromEntries(
					Object.entries(params).map(([key, value]) => [
						key,
						Array.isArray(value) ? value.join(',') : value,
					])
				)
			}).then(res => res)
	}
}