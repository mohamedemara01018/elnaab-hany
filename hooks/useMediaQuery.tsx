import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(() => {
        // Set initial state safely (handles SSR environments)
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQueryList = window.matchMedia(query);

        // Define a listener function to update state
        const listener = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => setMatches(event.matches);

        // Attach listener (supports older browsers via addListener)
        if (mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener('change', listener);
        } else {
            mediaQueryList.addListener(listener); // Fallback
        }

        // Set initial true/false value on mount
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMatches(mediaQueryList.matches);

        // Clean up listener on unmount
        return () => {
            if (mediaQueryList.removeEventListener) {
                mediaQueryList.removeEventListener('change', listener);
            } else {
                mediaQueryList.removeListener(listener); // Fallback
            }
        };
    }, [query]);

    return matches;
}
