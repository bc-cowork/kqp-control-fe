export const extractFileOptions = (fileTree) => {
    if (!fileTree || typeof fileTree !== 'object') {
        return [];
    }

    const fileOptions = Object.values(fileTree).flatMap(category => {
        return Object.keys(category).map(key => ({
            key: key,
            label: key
        }));
    });

    return fileOptions;
}