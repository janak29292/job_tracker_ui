export const checkStatus = response => {
  console.log('response handler >>>>>>>>>>>>>>>>>>>>>>>>>>>')
  console.log(response)
  return response
}

export const handleError = error => {
  console.log('response error handler >>>>>>>>>>>>>>>>>>>>>>>>>>>')
  console.log(Object.keys(error))
  console.log(error.response);
  throw error
}