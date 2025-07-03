import { z } from 'zod'

const schemaUser = z.object({
  fullName: z.string().min(8).max(55),
  username: z.string().regex(/^(?=.*[A-Z])(?=.*\d)/,
    { message: 'must contain at least a number and a uppercase' }).min(5).max(10),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*\d)/,
    { message: 'must contain at least a number and a uppercase' }).min(8).max(15)
})

export function validateSchemaUser (object) {
  return schemaUser.safeParse(object)
}

export function validatePartialUser (object) {
  return schemaUser.partial().safeParse(object)
}
