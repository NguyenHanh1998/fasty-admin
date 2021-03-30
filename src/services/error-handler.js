import i18n from '@/i18n'

const ErrorHandler = {
  getMessage (successMsg, errorMsg) {
    let message
    if (successMsg && successMsg.length !== 0) {
      message = successMsg
    } else if (errorMsg && errorMsg.length !== 0) {
      message = errorMsg
    }
    if (!message) {
      return ''
    }
    if (message.startsWith('smsg_')) {
      return i18n.t(`server_messages.${message}`)
    }
    return message
  },
}

export default ErrorHandler
