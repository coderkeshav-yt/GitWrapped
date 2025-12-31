import { Language, JobProfile, StackMatch } from "../types";

// ============================================
// JOB MARKET DATA (Mocked but Realistic)
// ============================================

const JOB_PROFILES: JobProfile[] = [
    {
        title: "Frontend Engineer",
        description: "Architecting user interfaces and web experiences.",
        icon: "🎨",
        requiredSkills: [
            { name: "TypeScript", weight: 3 },
            { name: "JavaScript", weight: 3 },
            { name: "React", weight: 2 },
            { name: "Vue", weight: 2 },
            { name: "Svelte", weight: 2 },
            { name: "CSS", weight: 1 },
            { name: "HTML", weight: 1 },
            { name: "Next.js", weight: 2 },
        ]
    },
    {
        title: "Backend Engineer",
        description: "Building robust APIs and server-side logic.",
        icon: "⚙️",
        requiredSkills: [
            { name: "Go", weight: 3 },
            { name: "Rust", weight: 3 },
            { name: "Java", weight: 3 },
            { name: "Python", weight: 2 },
            { name: "Node.js", weight: 2 },
            { name: "PostgreSQL", weight: 2 },
            { name: "SQL", weight: 1 },
            { name: "Docker", weight: 1 },
        ]
    },
    {
        title: "Full Stack Developer",
        description: "Master of both worlds, from DB to UI.",
        icon: "🌐",
        requiredSkills: [
            { name: "TypeScript", weight: 2 },
            { name: "JavaScript", weight: 2 },
            { name: "Python", weight: 2 },
            { name: "Node.js", weight: 2 },
            { name: "SQL", weight: 1 },
            { name: "React", weight: 1 },
            { name: "AWS", weight: 1 },
        ]
    },
    {
        title: "Data Scientist",
        description: "Turning raw data into actionable insights.",
        icon: "📊",
        requiredSkills: [
            { name: "Python", weight: 3 },
            { name: "Jupyter Notebook", weight: 3 },
            { name: "R", weight: 2 },
            { name: "SQL", weight: 2 },
            { name: "Julia", weight: 1 },
            { name: "K8s", weight: 1 },
        ]
    },
    {
        title: "DevOps Engineer",
        description: "Deploying, scaling, and automating infrastructure.",
        icon: "🚀",
        requiredSkills: [
            { name: "HCL", weight: 3 },
            { name: "Terraform", weight: 3 },
            { name: "Go", weight: 2 },
            { name: "Shell", weight: 2 },
            { name: "Python", weight: 1 },
            { name: "Docker", weight: 2 },
            { name: "Kubernetes", weight: 2 },
        ]
    },
    {
        title: "Mobile Developer",
        description: "Crafting experiences for small screens.",
        icon: "📱",
        requiredSkills: [
            { name: "Swift", weight: 3 },
            { name: "Kotlin", weight: 3 },
            { name: "Dart", weight: 2 },
            { name: "Flutter", weight: 2 },
            { name: "React Native", weight: 2 },
            { name: "Objective-C", weight: 1 },
        ]
    }
];

// Helper to normalize language names (e.g. handle variations if needed)
function normalizeSkill(skill: string): string {
    return skill.toLowerCase().trim();
}

/**
 * Calculate the best job match based on user's top languages
 */
export function calculateStackMatch(topLanguages: Language[]): StackMatch {
    let bestMatch: StackMatch = {
        role: "The Tinkerer",
        percentage: 0,
        description: "Exploring technologies without a specific niche yet.",
        matchedSkills: [],
        missingSkills: [],
        icon: "🔧"
    };

    let maxScore = 0;

    // Convert user languages to a Set for O(1) lookup
    const userSkills = new Set(topLanguages.map(l => normalizeSkill(l.name)));
    // Also add common implied mapping (e.g. if they have TS, they likely know JS)
    if (userSkills.has("typescript")) userSkills.add("javascript");
    if (userSkills.has("vue") || userSkills.has("react") || userSkills.has("svelte")) userSkills.add("javascript");

    for (const profile of JOB_PROFILES) {
        let currentScore = 0;
        let totalPossibleWeight = 0;
        const matched: string[] = [];
        const missing: string[] = [];

        // Calculate score for this profile
        for (const skill of profile.requiredSkills) {
            totalPossibleWeight += skill.weight;

            if (userSkills.has(normalizeSkill(skill.name))) {
                currentScore += skill.weight;
                matched.push(skill.name);
            } else {
                missing.push(skill.name);
            }
        }

        // Normalized match score (0-100)
        const percentage = totalPossibleWeight > 0 ? Math.round((currentScore / totalPossibleWeight) * 100) : 0;

        // Apply strict threshold: Must match at least 20% to even be considered
        if (percentage > 20 && percentage > maxScore) {
            maxScore = percentage;
            bestMatch = {
                role: profile.title,
                percentage,
                description: profile.description,
                matchedSkills: matched,
                missingSkills: missing.slice(0, 3), // Top 3 recommendation
                icon: profile.icon
            };
        }
    }

    // Fallback for very low matches
    if (maxScore < 25) {
        bestMatch = {
            role: "Versatile Explorer",
            percentage: maxScore, // Keep the low score but give a nice title
            description: "You dabble in a bit of everything without being tied down.",
            matchedSkills: bestMatch.matchedSkills,
            missingSkills: ["Focus on one stack", "Build deeper projects"],
            icon: "🧭"
        };
    }

    return bestMatch;
}
