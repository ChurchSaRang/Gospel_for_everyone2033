export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
    }).format(new Date(date));
}

export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}
