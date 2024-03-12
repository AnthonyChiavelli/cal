export function createFormDataFromObject(obj: { [k: string]: any }) {
  const formData = new FormData();
  for (const key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
}
