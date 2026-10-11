export const pluralize = (number: number, one: string, few: string, many: string) => {
    if (number % 100 >= 11 && number % 100 <= 14) {
        return many
    } else if (number % 10 === 1) {
        return one
    } else if (number % 10 >= 2 && number % 10 <= 4) {
        return few
    } else {
        return many
    }
}