export function pluralize(word: string, count: number, includeNumber: boolean, irregularPlural?: string) {
  const pluralizedWord = count === 1 ? word : irregularPlural || word+'s'
  return includeNumber ? `${count} ${pluralizedWord}` : pluralizedWord
}