import {alertConstants} from '../_constants/alert.constants.js'

export const success = message => ({
  type: alertConstants.SUCCESS, payload: message
})

export const error = message => ({ type: alertConstants.ERROR, payload: message })

export const clear = () => ({ type: alertConstants.CLEAR })