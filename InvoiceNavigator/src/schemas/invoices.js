import { z } from 'zod'

export const schemaInvoice = z.object({
  company: z.string().max(280),
  to: z.string().max(10),
  number: z.string().max(100),
  status: z.enum(['pending', 'accepted', 'rejected']),
  fileId: z.string().optional(),
  message: z.string().max(500).optional()
})

export const schemaFindInvoice = z.object({
  number: z.string().max(20),
  company: z.string().max(280),
  status: z.string().max(20),
  uploadAt: z.string().max(20)
})

export function validateInvoice (object, func) {
  return func.safeParse(object)
}

export function validatePartialInvoice (object, func) {
  return func.partial().safeParse(object)
}
