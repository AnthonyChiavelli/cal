export function createFormDataFromObject(obj: { [k: string]: any }) {
  const formData = new FormData();
  for (const key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
}

export function stringToBoolean(string: string | null) {
  return string === "true";
}
