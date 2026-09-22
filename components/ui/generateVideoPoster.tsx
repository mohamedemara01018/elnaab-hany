function generateVideoPoster(
    videoUrl: string,
    timeInSeconds: number = 1
): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.src = videoUrl;
        video.crossOrigin = "anonymous"; // Helps with CORS if videos are hosted on external CDN
        video.currentTime = timeInSeconds;
        video.muted = true;
        video.playsInline = true;

        const handleSeeked = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 360;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject("Canvas context not supported");
                    return;
                }

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

                // Clean up event listeners and video element
                video.removeEventListener("seeked", handleSeeked);
                video.src = "";

                resolve(dataUrl);
            } catch (err) {
                reject(err);
            }
        };

        video.addEventListener("seeked", handleSeeked);
        video.addEventListener("error", (e) => reject(e));
    });
}

export default generateVideoPoster;