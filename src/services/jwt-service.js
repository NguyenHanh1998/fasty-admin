const TOKEN_KEY = 'jwtToken'

export const getToken = () => {
  return window.localStorage.getItem(TOKEN_KEY)
}

export const saveToken = (token) => {
  return window.localStorage.setItem(TOKEN_KEY, token)
}

export const destroyToken = () => {
  return window.localStorage.removeItem(TOKEN_KEY)
}
