export function pluralize(word: string, count: number, includeNumber: boolean, irregularPlural?: string) {
  const pluralizedWord = count === 1 ? word : irregularPlural || word + "s";
  return includeNumber ? `${count} ${pluralizedWord}` : pluralizedWord;
}

export function toCapitalCase(word: string) {
  return word[0].toUpperCase() + word.toLocaleLowerCase().slice(1);
}
