import { useEffect, useRef } from 'react';

export function useUpdateEffect(effect, deps) {
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        return effect();
    }, deps);
}

export function updateOrInsert(items, newItem) {
    // Use findIndex to locate the object by its key
    const index = items.findIndex(item => item.id === newItem.id);

    if (index !== -1) {
        // If found, update the existing object
        items[index] = { ...items[index], ...newItem };
    } else {
        // If not found, insert the new object
        items.push(newItem);
    }
}