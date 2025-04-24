export const fetchHackathons = async () => {
    try {
        const response = await fetch('/api/compare/hackathons');
        if (!response.ok) throw new Error('Failed to fetch hackathons');
        return await response.json();
    } catch (error) {
        console.error('Error fetching hackathons:', error);
        return [];
    }
};

export const fetchParticipantCounts = async (hackathonId: string) => {
    try {
        const response = await fetch(`/api/compare/participant_count?hackathon_id=${hackathonId}`);
        if (!response.ok) throw new Error('Failed to fetch participant counts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching participant counts:', error);
        return [];
    }
};

export const fetchAverageScores = async (hackathonId: string) => {
    try {
        const response = await fetch(`/api/compare/average_scores?hackathon_id=${hackathonId}`);
        if (!response.ok) throw new Error('Failed to fetch average scores');
        return await response.json();
    } catch (error) {
        console.error('Error fetching average scores:', error);
        return [];
    }
};
