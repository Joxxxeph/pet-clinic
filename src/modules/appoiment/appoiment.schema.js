import z from 'zod'
import { extractValidationData } from '../../common/utils/extractErrorData.js'

const appoimentSchema = z.object({
  startTime: z.string(),
  reason: z.string().min(10),
  petId: z.number(),
  medicId: z.number()
})

export function validateAppoiment(data) {
  const result = appoimentSchema.safeParse(data)

  const { hasError, errorMessages, data: appoimentData} = extractValidationData(result)

  return {
    hasError, errorMessages, appoimentData
  }

}