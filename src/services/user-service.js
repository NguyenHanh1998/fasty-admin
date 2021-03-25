const USER_KEY = 'userKey'

export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

export const saveUser = (userInfo) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
}

export const destroyUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
