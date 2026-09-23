"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { decodeJwt, JWTPayload } from "jose";
import { UserRole } from "@/utils/enums.utils";

// .NET / WS-Federation Claim URIs
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const EMAIL_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

interface TokenPayload extends JWTPayload {
    [ROLE_CLAIM]?: UserRole;
    [EMAIL_CLAIM]?: string;
    [ID_CLAIM]?: string;
    role?: UserRole;
}

const socialRoutes = ["/admin", "/briefing-requests", "/achievements", "/team", "/events", "/activities", "/videos"];
const employeeRoutes = ["/employee"];
const adminRoutes = ["/social", "/register-employee", "/employees"];
const sharedProtectedRoutes = ["/profile", "/settings", "/change-password"];

const authRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
];

// Helper to check if current pathname matches a route exact or sub-path boundary
const matchRoute = (currentPath: string, routes: string[]) => {
    return routes.some((route) => {
        if (currentPath === route) return true;
        return currentPath.startsWith(`${route}/`);
    });
};

interface AuthInfo {
    token: string | null;
    userRole?: UserRole;
    isValid: boolean;
}

let cachedToken: string | null = null;
let cachedAuthInfo: AuthInfo = { token: null, isValid: false };

function subscribeStorage(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

function getStoredAuthInfo(): AuthInfo {
    if (typeof window === "undefined") {
        return { token: null, isValid: false };
    }
    const token = localStorage.getItem("accessToken");
    if (token === cachedToken) {
        return cachedAuthInfo;
    }
    cachedToken = token;
    if (!token) {
        cachedAuthInfo = { token: null, isValid: false };
        return cachedAuthInfo;
    }
    try {
        const rawPayload = decodeJwt(token) as TokenPayload;
        const userRole = rawPayload[ROLE_CLAIM] || rawPayload.role;
        const isExpired = Boolean(rawPayload.exp && rawPayload.exp * 1000 < Date.now());
        if (isExpired) {
            localStorage.removeItem("accessToken");
            cachedAuthInfo = { token: null, isValid: false };
        } else {
            cachedAuthInfo = { token, userRole, isValid: true };
        }
    } catch {
        localStorage.removeItem("accessToken");
        cachedAuthInfo = { token: null, isValid: false };
    }
    return cachedAuthInfo;
}

function getServerAuthInfo(): AuthInfo {
    return { token: null, isValid: false };
}

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const authInfo = useSyncExternalStore(subscribeStorage, getStoredAuthInfo, getServerAuthInfo);

    const isAuthRoute = matchRoute(pathname, authRoutes);
    const isAdminRoute = matchRoute(pathname, adminRoutes);
    const isEmployeeRoute = matchRoute(pathname, employeeRoutes);
    const isSocialRoute = matchRoute(pathname, socialRoutes);
    const isSharedProtectedRoute = matchRoute(pathname, sharedProtectedRoutes);

    const isProtectedRoute =
        isAdminRoute || isEmployeeRoute || isSocialRoute || isSharedProtectedRoute;

    let isAuthorized = false;

    if (!authInfo.isValid) {
        if (!isProtectedRoute) {
            isAuthorized = true;
        }
    } else {
        const userRole = authInfo.userRole;
        if (isAuthRoute) {
            isAuthorized = false;
        } else if (isAdminRoute && userRole !== UserRole.ADMIN) {
            isAuthorized = false;
        } else if (isEmployeeRoute && userRole !== UserRole.EMPLOYEE) {
            isAuthorized = false;
        } else if (isSocialRoute && userRole !== UserRole.SOCIAL) {
            isAuthorized = false;
        } else if (matchRoute(pathname, ["/profile"]) && userRole !== UserRole.EMPLOYEE) {
            isAuthorized = false;
        } else {
            isAuthorized = true;
        }
    }

    useEffect(() => {
        if (!authInfo.isValid) {
            if (isProtectedRoute) {
                router.replace("/login");
            }
            return;
        }

        const userRole = authInfo.userRole;

        // Prevent logged-in users from accessing auth pages
        if (isAuthRoute) {
            router.replace("/");
            return;
        }

        // Role-based access control
        if (isAdminRoute && userRole !== UserRole.ADMIN) {
            router.replace("/");
            return;
        }

        if (isEmployeeRoute && userRole !== UserRole.EMPLOYEE) {
            router.replace("/");
            return;
        }

        if (isSocialRoute && userRole !== UserRole.SOCIAL) {
            router.replace("/");
            return;
        }

        if (matchRoute(pathname, ["/profile"]) && userRole !== UserRole.EMPLOYEE) {
            router.replace("/");
            return;
        }
    }, [pathname, router, authInfo, isProtectedRoute, isAuthRoute, isAdminRoute, isEmployeeRoute, isSocialRoute]);

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
