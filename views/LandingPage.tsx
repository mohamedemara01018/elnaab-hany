"use client";


import { Hero } from "@/components/landing-page/hero";
import { About } from "@/components/landing-page/about";
import { Stats } from "@/components/landing-page/stats";
import { Work } from "@/components/landing-page/work";
import { Videos } from "@/components/landing-page/videos";
import { Briefings } from "@/components/landing-page/briefings";
import { Gallery } from "@/components/landing-page/gallery";
import { Achievements } from "@/components/landing-page/achievements";
import { Complaints } from "@/components/landing-page/complaints";
import { Contact } from "@/components/landing-page/contact";
import PublicLayout from "@/components/layout/public/PublicLayout";

export default function LandingPage() {
    return (
        <PublicLayout>
            <Hero />
            <About />
            <Stats />
            <Work />
            <Videos />
            <Briefings />
            <Gallery />
            <Achievements />
            <Complaints />
            <Contact />
        </PublicLayout>
    );
}
