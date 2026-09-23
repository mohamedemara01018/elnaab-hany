"use client";

import { useState, useEffect } from "react";
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

import { heroService } from "@/services/hero.service";
import { achievementService } from "@/services/achievement.service";
import { videoService } from "@/services/video.service";
import { activityVisitService } from "@/services/activities-visits.service";
import { briefingRequestsService } from "@/services/briefing-requests.service";
import { activitiesService } from "@/services/activities.service";

import { HeroInfoData, GetHeroInfoResponse } from "@/types/hero.types";
import { GetAchievementsResponse } from "@/types/achievement.types";
import { GetActivitiesVisitsResponse } from "@/types/activity-visit.types";
import { BriefingRequestApiResponse, BriefingRequestItem } from "@/types/briefing-requests.types";
import { GetVideosResponse } from "@/types/video.types";
import { ApiResponse, Activity } from "@/types/activities.types";

export default function LandingPage() {
    const [heroData, setHeroData] = useState<HeroInfoData | GetHeroInfoResponse | null>(null);
    const [achievementsData, setAchievementsData] = useState<GetAchievementsResponse | null>(null);
    const [activityVisitsData, setActivityVisitsData] = useState<GetActivitiesVisitsResponse | null>(null);
    const [activitiesData, setActivitiesData] = useState<ApiResponse<Activity[]> | null>(null);
    const [briefingsData, setBriefingsData] = useState<BriefingRequestApiResponse<BriefingRequestItem[]> | null>(null);
    const [videosData, setVideosData] = useState<GetVideosResponse | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchLandingData = async () => {
            try {
                const [
                    heroRes,
                    achievementsRes,
                    activityVisitsRes,
                    activitiesRes,
                    briefingsRes,
                    videosRes,
                ] = await Promise.allSettled([
                    heroService.getHeroInfo(),
                    achievementService.getAll(),
                    activityVisitService.getAll(),
                    activitiesService.getAll(),
                    briefingRequestsService.getAll(),
                    videoService.getAll(),
                ]);

                if (!isMounted) return;

                if (heroRes.status === "fulfilled") setHeroData(heroRes.value);
                if (achievementsRes.status === "fulfilled") setAchievementsData(achievementsRes.value);
                if (activityVisitsRes.status === "fulfilled") setActivityVisitsData(activityVisitsRes.value);
                if (activitiesRes.status === "fulfilled") setActivitiesData(activitiesRes.value);
                if (briefingsRes.status === "fulfilled") setBriefingsData(briefingsRes.value);
                if (videosRes.status === "fulfilled") setVideosData(videosRes.value);
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching landing page data:", err);
                }
            }
        };

        fetchLandingData();

        return () => {
            isMounted = false;
        };
    }, []);
    return (
        <PublicLayout>
            <Hero data={heroData} />
            <About data={heroData} />
            <Stats />
            <Work data={activitiesData} />
            <Videos data={videosData} />
            <Briefings data={briefingsData} />
            <Gallery data={activityVisitsData} />
            <Achievements data={achievementsData} />
            <Complaints />
            <Contact data={heroData} />
        </PublicLayout>
    );
}