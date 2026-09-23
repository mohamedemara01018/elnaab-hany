import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQueryList = window.matchMedia(query);
        const updateMatch = () => {
            setMatches(mediaQueryList.matches);
        };

        // Initial sync
        updateMatch();

        mediaQueryList.addEventListener("change", updateMatch);
        return () => {
            mediaQueryList.removeEventListener("change", updateMatch);
        };
    }, [query]);

    return matches;
}

