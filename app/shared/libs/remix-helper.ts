export const trimFormData = (formData: FormData, key: string) => {
  const data = formData.get(key)
  if (typeof data === 'string') return data.trim()
  else return data
}

export const trimFormDataEntryValue = (
  formDataEntryValue: FormDataEntryValue
) => {
  if (typeof formDataEntryValue === 'string') return formDataEntryValue.trim()
  else return formDataEntryValue
}
