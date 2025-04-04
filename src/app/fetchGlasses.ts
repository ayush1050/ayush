export async function fetchRecommendedGlasses(faceShape: string) {
    
        const response = await fetch(
            `https://api.example.com/getGlasses?faceShape=${faceShape}`
        );
        const data = await response.json();
        return data.glasses; // Returns an array of recommended glasses
    
        return [];
    }

