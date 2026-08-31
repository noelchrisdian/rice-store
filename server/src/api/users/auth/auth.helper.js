import jwt from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'

import { AVATAR } from '../../../core/config.js'
import { BadRequest } from '../../../shared/error/bad_request.error.js'
import { cloudinaryUploader } from '../../../shared/service/multer.service.js'
import { JWT_SECRET } from '../../../core/config.js'
import { NotFound } from '../../../shared/error/not_found.error.js'
import { Unauthorized } from '../../../shared/error/unauthorized.error.js'
import { UserModel as Users } from '../../users/user.model.js'

const SignInHelper = async ({ data }) => {
  console.log(data)
  const { phoneNumber, password } = data
  if (!phoneNumber || !password) {
    throw new BadRequest('PLEASE PROVIDE PHONE NUMBER AND PASSWORD')
  }

  const user = await Users.findOne({ phoneNumber })
  if (!user) {
    throw new Unauthorized(`PHONE NUMBER NOT EXIST`)
  }

  const passwordMatch = await compare(password, user.password)
  if (!passwordMatch) {
    throw new Unauthorized('INCORRECT PASSWORD')
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '6h' }
  )

  return {
    token,
    user
  }
}

const SignUpHelper = async ({ data, file }) => {
  let uploadImage

  try {
    const check = await Users.findOne({
      $or: [{ phoneNumber: data.phoneNumber }, { email: data.email }]
    })
    if (check) {
      if (check.email === data.email) {
        throw new BadRequest('EMAIL EXISTED')
      }

      if (check.phoneNumber === data.phoneNumber) {
        throw new BadRequest('PHONE NUMBER EXISTED')
      }
    }

    if (data.password !== data.confirmPassword) throw new BadRequest(`PASSWORD NOT MATCH`)
    const salt = await genSalt(12)
    const hashedPassword = await hash(data.password, salt)

    if (file) {
      uploadImage = await cloudinaryUploader(file.buffer, 'avatar')
    }

    return Users.create({
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: hashedPassword,
      role: 'customer',
      avatar: {
        imageURL: uploadImage?.secure_url || AVATAR.DEFAULT_URL,
        imagePublicID: uploadImage?.public_id || AVATAR.DEFAULT_PUBLIC_ID
      },
      address: data.address
    })
  } catch (error) {
    if (uploadImage?.public_id) {
      await cloudinary.uploader.destroy(uploadImage.public_id)
    }
    throw error
  }
}

const UpdateUserHelper = async ({ data, file, reqUser }) => {
  let uploadImage

  try {
    const user = await Users.findOne({ _id: reqUser.id })
    if (!user) throw new NotFound(`USER NOT EXIST`)

    if (data.email && data.email !== user.email) {
      const exist = await Users.findOne({ email: data.email, _id: { $ne: user._id } })
      if (exist) throw new BadRequest(`EMAIL EXISTED`)
    }

    if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
      const exist = await Users.findOne({
        phoneNumber: data.phoneNumber,
        _id: { $ne: user._id }
      })
      if (exist) throw new BadRequest(`PHONE NUMBER EXISTED`)
    }

    if (data.name) user.name = data.name
    if (data.phoneNumber) user.phoneNumber = data.phoneNumber
    if (data.email) user.email = data.email
    if (data.address) user.address = data.address

    if (data.password || data.confirmPassword) {
      if (data.password !== data.confirmPassword) throw new BadRequest(`PASSWORD NOT MATCH`)

      user.password = data.password
    }

    const oldPublicID = user.avatar?.imagePublicID
    if (file) {
      uploadImage = await cloudinaryUploader(file.buffer, 'avatar')
      user.avatar.imageURL = uploadImage.secure_url
      user.avatar.imagePublicID = uploadImage.public_id
    }

    await user.save()
    if (file && oldPublicID && oldPublicID !== AVATAR.DEFAULT_PUBLIC_ID) {
      await cloudinary.uploader.destroy(oldPublicID)
    }

    return user
  } catch (error) {
    if (uploadImage?.public_id) {
      await cloudinary.uploader.destroy(uploadImage.public_id)
    }
    throw error
  }
}

export { SignInHelper, SignUpHelper, UpdateUserHelper }
