
export const STORAGE_KEY = 'molt_companion_bookmarks';

export function getBookmarkIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse bookmarks", e);
        return [];
    }
}

export function isBookmarked(id: string): boolean {
    const ids = getBookmarkIds();
    return ids.includes(id);
}

export function toggleBookmark(id: string): boolean {
    const ids = getBookmarkIds();
    const index = ids.indexOf(id);
    let newIds: string[];
    let isAdded = false;

    if (index === -1) {
        newIds = [...ids, id];
        isAdded = true;
    } else {
        newIds = ids.filter(bookmarkId => bookmarkId !== id);
        isAdded = false;
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
        // Dispatch a custom event so components can update immediately
        window.dispatchEvent(new Event('bookmarks-updated'));
    }

    return isAdded;
}
