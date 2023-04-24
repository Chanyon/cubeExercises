export function getYear(): string {
    const year = new Date().getFullYear();
    if (year === 2023) {
        return "";
    }
    return year.toString();
}