import { pluralize } from "../../../shared/utils/pluralize";

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