export const extractFileOptions = (fileTree: { [s: string]: unknown; } | ArrayLike<unknown>) => {
    if (!fileTree || typeof fileTree !== 'object') {
        return [];
    }

    const fileOptions = Object.values(fileTree).flatMap(category => {
        if (typeof category !== 'object' || category === null) {
            return [];
        }
        return Object.keys(category).map(key => ({
            key,
            label: key
        }));
    });

    return fileOptions;
}