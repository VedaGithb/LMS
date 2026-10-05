const pluralize = (number: number, one: string, few: string, many: string) => {
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

export const formatDuration = (totalDuration: number) => {
    if (!totalDuration) {
        return "Не указано"
    }
    const hours = Math.trunc(totalDuration / 60);
    const minutes = totalDuration % 60;
    if (hours === 0) {
        return `${minutes} ${pluralize(totalDuration, "минута", "минуты", "минут")}`
    } else if (minutes === 0) {
        return `${hours} ${pluralize(hours, "час", "часа", "часов")}`
    } else {
        return `${hours} ${pluralize(hours, "час", "часа", "часов")} ${minutes} ${pluralize(minutes, "минута", "минуты", "минут")}`
    }
}