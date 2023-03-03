export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export const makeCategory = (slug: string) : string => {
    return slug?.split('-').join(' ')
}

export const capitalizeFirstLetter = (str: string) : string => {
        return str?.charAt(0).toUpperCase() + str?.slice(1)
}