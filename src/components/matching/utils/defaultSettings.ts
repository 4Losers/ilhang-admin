export const DEFAULT_MATCHING_SETTINGS = {
    matchingStrategy: 'SUCCESS_RATE',
    teamSize: {
        min: 2,
        max: 6,
        preferred: 4
    },
    priorityConditions: {
        highSuccessRate: true,
        similarLevel: true,
        timeZone: false,
        language: false
    },
    autoMatching: {
        enabled: true,
        delayMinutes: 30,
        maxRetries: 3
    }
}; 