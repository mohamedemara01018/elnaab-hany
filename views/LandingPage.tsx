"use client";

import "../app/globals.css";

import { Navbar } from "@/components/landing-page/navbar";
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
import { Footer } from "@/components/landing-page/footer";

export default function LandingPage() {
    return (
        <div className="bg-background text-foreground min-h-screen">
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
        </div>
    );
}
