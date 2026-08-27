import 'dotenv/config'

const AVATAR = {
  DEFAULT_URL: process.env.DEFAULT_AVATAR_URL,
  DEFAULT_PUBLIC_ID: process.env.DEFAULT_AVATAR_PUBLIC_ID
}

const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET
}

const MIDTRANS_CONFIG = {
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
  CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY
}

const DB_URL = process.env.DB_URL
const JWT_SECRET = process.env.JWT_SECRET
const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT || 3000

export { AVATAR, CLOUDINARY_CONFIG, DB_URL, JWT_SECRET, MIDTRANS_CONFIG, NODE_ENV, PORT }
