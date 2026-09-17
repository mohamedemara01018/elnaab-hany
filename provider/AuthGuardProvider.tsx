/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
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

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    useEffect(() => {
        setIsAuthorized(false);
        const token = localStorage.getItem("accessToken");

        const isAuthRoute = matchRoute(pathname, authRoutes);
        const isAdminRoute = matchRoute(pathname, adminRoutes);
        const isEmployeeRoute = matchRoute(pathname, employeeRoutes);
        const isSocialRoute = matchRoute(pathname, socialRoutes);
        const isSharedProtectedRoute = matchRoute(pathname, sharedProtectedRoutes);

        const isProtectedRoute =
            isAdminRoute || isEmployeeRoute || isSocialRoute || isSharedProtectedRoute;

        // --------------------------------
        // 1. NO TOKEN
        // --------------------------------
        if (!token) {
            if (isProtectedRoute) {
                router.replace("/login");
                return;
            }
            setIsAuthorized(true);
            return;
        }

        // --------------------------------
        // 2. DECODE TOKEN USING JOSE
        // --------------------------------
        try {
            const rawPayload = decodeJwt(token) as TokenPayload;
            const userRole = rawPayload[ROLE_CLAIM] || rawPayload.role;
            console.log('rawpayload', rawPayload);

            // Check Expiration
            if (rawPayload.exp && rawPayload.exp * 1000 < Date.now()) {
                localStorage.removeItem("accessToken");
                router.replace("/login");
                return;
            }

            // Prevent logged-in users from accessing auth pages (login, register, etc.)
            if (isAuthRoute) {
                router.replace("/");
                return;
            }

            // --------------------------------
            // 3. ROLE-BASED ACCESS CONTROL
            // --------------------------------
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

            // Restrict /profile strictly to EMPLOYEE role
            const isProfileRoute = matchRoute(pathname, ["/profile"]);
            if (isProfileRoute && userRole !== UserRole.EMPLOYEE) {
                router.replace("/");
                return;
            }

            setIsAuthorized(true);
        } catch (error) {
            console.error("Invalid token found in localStorage:", error);
            localStorage.removeItem("accessToken");
            router.replace("/login");
        }
    }, [pathname, router]);

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}