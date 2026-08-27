import { StatusCodes } from 'http-status-codes'

import { ParseError } from '../error/parse_error.error.js'

const ValidationInput = async (schema, payload) => {
  const parse = await schema.safeParseAsync(payload)
  if (!parse.success) {
    const errors = parse.error.issues.map((error) => error.message)
    throw new ParseError('INVALID DATA TYPE', StatusCodes.BAD_GATEWAY, errors)
  }

  return parse.data
}

export { ValidationInput }
