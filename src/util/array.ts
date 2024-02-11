type primitive = string | number | bigint | boolean | symbol | null | undefined;
export function shallowCompareArrays(array1: Array<primitive>, array2: Array<primitive>, orderMatters = true): boolean {
  if (orderMatters) {
    return JSON.stringify(array1) === JSON.stringify(array2);
  }
  return array1.every((e) => array2.includes(e)) && array2.every((e) => array1.includes(e));
}
