import { GitWrappedData, RoastData } from "../types";

const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "xiaomi/mimo-v2-flash:free";

/**
 * Generate AI-powered roast and toast for a GitHub user
 */
export const generateRoastAndToast = async (data: GitWrappedData): Promise<RoastData> => {
    try {
        // Craft intelligent prompt based on user's GitHub data
        const userStats = `
Username: ${data.username}
Archetype: ${data.archetype}
Total Commits: ${data.totalCommits}
Longest Streak: ${data.longestStreak} days
Busiest Day: ${data.busiestDay}
Top Language: ${data.topLanguages[0]?.name || 'Unknown'}
Top Repo: ${data.topRepo.name} (${data.topRepo.stars} stars)
Productivity: ${data.productivity.timeOfDay} coder
PRs: ${data.contributionBreakdown.prs}
Issues: ${data.contributionBreakdown.issues}
Reviews: ${data.contributionBreakdown.reviews}
Followers: ${data.community.followers}
Total Stars: ${data.community.totalStars}
Stack Match: ${data.stackMatch.role} (${data.stackMatch.percentage}%)
        `.trim();

        // Generate both roast and toast in parallel using OpenRouter
        const [roastResponse, toastResponse] = await Promise.all([
            // Roast prompt
            fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [{
                        role: "user",
                        content: `You are a legendary roast master known for savage yet hilarious GitHub profile roasts. Your roasts are CREATIVE, UNEXPECTED, and make people laugh out loud while being playfully brutal.

Analyze this developer's GitHub stats and create an EPIC roast that:
- Uses clever wordplay, metaphors, or pop culture references
- Finds the MOST interesting pattern to mock (not just obvious stuff)
- Is genuinely funny and memorable (not generic)
- Stays playful and fun (never actually mean)
- Makes them go "damn, that's actually clever!"

GitHub Stats:
${userStats}

IMPORTANT RULES:
- Be CREATIVE and UNEXPECTED - avoid boring observations
- Use vivid imagery and comparisons
- Make it quotable and shareable
- 2-3 sentences max, under 280 characters
- Write ONLY the roast, nothing else

Example style (don't copy, just match the energy):
"Your commit history looks like a heartbeat monitor during a panic attack - lots of activity at 3 AM followed by flatlines. Those 47 'fix typo' commits? Chef's kiss of chaos! 😘"

Now roast this developer:`
                    }],
                    temperature: 1.4,
                    max_tokens: 200
                })
            }),
            // Toast prompt
            fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [{
                        role: "user",
                        content: `You are an inspiring tech mentor who gives GENUINE, SPECIFIC praise that makes developers feel truly seen and appreciated. Your toasts are MEANINGFUL, not generic corporate speak.

Analyze this developer's GitHub stats and create an INSPIRING toast that:
- Highlights their UNIQUE strengths and patterns
- Uses specific numbers and achievements (not vague praise)
- Feels personal and authentic
- Motivates them to keep going
- Makes them feel proud of their work

GitHub Stats:
${userStats}

IMPORTANT RULES:
- Be SPECIFIC - use their actual stats and patterns
- Avoid generic phrases like "keep up the good work"
- Make it feel personal and genuine
- Show you actually analyzed their work
- 2-3 sentences max, under 280 characters
- Write ONLY the toast, nothing else

Example style (don't copy, just match the authenticity):
"That 45-day streak isn't just consistency - it's dedication. You've built something real with those 2,815 commits, and your ${data.topLanguages[0]?.name} skills show it. The community sees you - ${data.community.totalStars} stars don't lie! 🌟"

Now celebrate this developer:`
                    }],
                    temperature: 1.1,
                    max_tokens: 200
                })
            })
        ]);

        // Log responses for debugging
        console.log('Roast response status:', roastResponse.status);
        console.log('Toast response status:', toastResponse.status);

        if (!roastResponse.ok) {
            const errorText = await roastResponse.text();
            console.error('Roast API error:', errorText);
            throw new Error(`Roast API failed: ${roastResponse.status}`);
        }

        if (!toastResponse.ok) {
            const errorText = await toastResponse.text();
            console.error('Toast API error:', errorText);
            throw new Error(`Toast API failed: ${toastResponse.status}`);
        }

        const roastData = await roastResponse.json();
        const toastData = await toastResponse.json();

        // Log the actual responses for debugging
        console.log('Roast data:', roastData);
        console.log('Toast data:', toastData);

        // Extract content from OpenRouter response format
        const roast = roastData.choices?.[0]?.message?.content?.trim() || getFallbackRoast(data);
        const toast = toastData.choices?.[0]?.message?.content?.trim() || getFallbackToast(data);

        console.log('Final roast:', roast);
        console.log('Final toast:', toast);

        return { roast, toast };

    } catch (error: any) {
        console.warn('⚠️ AI API error - using curated fallback content:', error.message);

        // Return fallback content on error
        return {
            roast: getFallbackRoast(data),
            toast: getFallbackToast(data)
        };
    }
};

/**
 * Fallback roast when API fails
 */
const getFallbackRoast = (data: GitWrappedData): string => {
    const roasts = [
        `${data.totalCommits} commits and still using ${data.topLanguages[0]?.name}? Bold choice! 😏`,
        `A ${data.longestStreak}-day streak? Someone forgot they have a life outside of VS Code! 🤓`,
        `${data.archetype} with ${data.community.totalStars} stars? The GitHub algorithm is being generous today! ⭐`,
        `Coding on ${data.busiestDay}? Even your keyboard needs a weekend! ⌨️`,
        `${data.contributionBreakdown.prs} PRs but ${data.topRepo.stars} stars? Math isn't mathing! 📊`,
        `${data.productivity.timeOfDay} coder? More like professional night owl trying to debug life! 🦉`,
        `${data.topRepo.name} is your magnum opus? Setting the bar real high there! 🎯`,
        `${data.topLanguages[0]?.name} developer? I see you like living dangerously! 🎲`,
        `${data.longestStreak} days straight? Your coffee machine deserves a raise! ☕`,
        `${data.community.followers} followers watching you commit crimes against clean code! 👀`
    ];
    return roasts[Math.floor(Math.random() * roasts.length)];
};

/**
 * Fallback toast when API fails
 */
const getFallbackToast = (data: GitWrappedData): string => {
    const toasts = [
        `${data.totalCommits} commits of pure dedication! You're building something amazing! 🚀`,
        `A ${data.longestStreak}-day streak shows incredible consistency. Keep that momentum! 🔥`,
        `${data.archetype} - you're mastering your craft one commit at a time! 💪`,
        `${data.community.totalStars} stars earned through hard work. Your code inspires others! ⭐`,
        `${data.contributionBreakdown.prs} PRs merged - you're making the open source world better! 🌟`,
        `${data.productivity.timeOfDay} productivity is your superpower! Own it! ⚡`,
        `${data.topRepo.name} showcases your talent. The world needs more builders like you! 🏗️`,
        `${data.topLanguages[0]?.name} mastery in progress! Every line of code is a step forward! 📈`,
        `${data.community.followers} people believe in your vision. That's leadership! 👑`,
        `${data.busiestDay} hustle? That's the dedication that changes the world! 🌍`
    ];
    return toasts[Math.floor(Math.random() * toasts.length)];
};
