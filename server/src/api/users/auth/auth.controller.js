import { StatusCodes } from 'http-status-codes'

import { NODE_ENV } from '../../../core/config.js'
import { SendSuccess } from '../../../shared/utils/response.utils.js'
import { SignInHelper, SignUpHelper, UpdateUserHelper } from './auth.helper.js'
import { SignInSchema, UserSchema } from '../user.schema.js'
import { ValidationInput } from '../../../shared/utils/input_validation.utils.js'

const SignIn = async (req, res, next) => {
  try {
    const data = await ValidationInput(SignInSchema, req.body)
    const { token, user } = await SignInHelper(data)

    res.cookie('token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 6 * 60 * 60 * 1000
    })

    SendSuccess(
      res,
      {
        name: user.name,
        role: user.role,
        avatar: {
          imageURL: user.avatar.imageURL
        }
      },
      'Sign in successful'
    )
  } catch (error) {
    next(error)
  }
}

const SignOut = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax'
  })

  SendSuccess(res, {}, 'Sign out successful')
}

const SignUp = async (req, res, next) => {
  try {
    const data = await ValidationInput(UserSchema, req.body)
    const user = await SignUpHelper({
      data,
      file: req.file
    })
    SendSuccess(res, user, 'Sign up successful', StatusCodes.CREATED)
  } catch (error) {
    next(error)
  }
}

const UpdateUser = async (req, res, next) => {
  try {
    const data = await ValidationInput(UserSchema, req.body)
    const user = await UpdateUserHelper({
      data,
      file: req.file,
      reqUser: req.user
    })
    SendSuccess(res, user, `User ${user.name} has been updated`)
  } catch (error) {
    next(error)
  }
}

export { SignIn, SignOut, SignUp, UpdateUser }
