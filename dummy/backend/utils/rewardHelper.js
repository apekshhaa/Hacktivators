export const DEFAULT_BADGES = [
    { id: 1, name: 'Regular Checkup Family', desc: '10+ checkups completed', icon: '👨‍👩‍👧‍👦' },
    { id: 2, name: 'Health Champion', desc: 'Maintained 6-month streak', icon: '💪' },
    { id: 3, name: 'Vaccination Hero', desc: 'All family vaccinated', icon: '💉' },
    { id: 4, name: 'Perfect Attendance', desc: 'No missed appointments', icon: '✨' },
];

export const DEFAULT_BENEFITS = [
    { id: 1, name: 'Monthly Ration Kit', points: 400 },
    { id: 2, name: 'Free Medicine Voucher', points: 300 },
    { id: 3, name: 'Health Insurance Subsidy', points: 600 },
];

export const syncRewardData = async (reward, checkupCount = 0) => {
    // 1. Ensure Defaults exist
    if (!reward.badges || reward.badges.length === 0) {
        reward.badges = DEFAULT_BADGES.map(b => ({ ...b, unlocked: false }));
    }
    if (!reward.benefits || reward.benefits.length === 0) {
        reward.benefits = DEFAULT_BENEFITS.map(b => ({ ...b, eligible: false }));
    }

    // 2. Sync Benefits Eligibility
    reward.benefits = reward.benefits.map(benefit => {
        const config = DEFAULT_BENEFITS.find(b => b.id === benefit.id) || benefit;
        return {
            ...benefit,
            points: config.points, // Keep points requirement updated
            eligible: reward.totalPoints >= config.points
        };
    });

    // 3. Sync Badges Unlocking
    reward.badges = reward.badges.map(badge => {
        let unlocked = badge.unlocked;

        switch (badge.id) {
            case 1: // Regular Checkup Family
                if (checkupCount >= 10) unlocked = true;
                break;
            case 2: // Health Champion
                if (reward.currentStreak >= 6) unlocked = true;
                break;
            case 3: // Vaccination Hero
                // Keep existing unlocked status, or add logic if vaccination data is available
                break;
            case 4: // Perfect Attendance
                if (reward.currentStreak >= 8) unlocked = true;
                break;
        }

        return { ...badge, unlocked };
    });

    // 4. Overall Eligibility
    reward.rewardEligibility = reward.totalPoints >= 300;

    return reward;
};
