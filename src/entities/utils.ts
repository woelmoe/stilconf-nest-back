/** фильтр входящих полей */
export function filterFields(body: { [k: string]: any }, fields: unknown[]) {
  const filteredBody: { [k: string]: any } = {}

  Object.keys(body).filter((k) => {
    if (fields.includes(k)) {
      filteredBody[k] = body[k]
    }
  })

  return filteredBody
}

export function generateRandomString(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
