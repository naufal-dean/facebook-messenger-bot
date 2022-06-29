const removeTimePart = (date: Date) => {
    date.setHours(0, 0, 0, 0);
    return date;
}

const daysUntilBirthday = (birthDate?: Date) => {
    if (!birthDate || isNaN(birthDate.getTime())) {
        return -1;
    }

    const now = removeTimePart(new Date());

    const nextBirthday = removeTimePart(birthDate);
    nextBirthday.setFullYear(now.getFullYear());
    if (nextBirthday < now) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    const dayUnit = 1000 * 60 * 60 * 24;
    return Math.ceil((nextBirthday.getTime() - now.getTime()) / dayUnit);
}

export { daysUntilBirthday };