import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WOLFRAM_API_KEY = process.env.WOLFRAM_APP_ID;
const WOLFRAM_API_URL = "https://api.wolframalpha.com/v2/query";

// Ensure API key is present
if (!WOLFRAM_API_KEY) {
    console.error("Missing Wolfram API Key in .env file");
    process.exit(1);
}

/**
 * Fetches a response from Wolfram Alpha.
 * @param {string} query - The query to send.
 * @returns {Promise<string>} - The API response as plain text.
 */
export const getWolframResponse = async (query) => {
    try {
        const response = await axios.get(WOLFRAM_API_URL, {
            params: {
                input: query,
                format: "json",
                output: "JSON",
                appid: WOLFRAM_API_KEY
            }
        });

        const result = response.data.queryresult;
        if (!result.success) {
            return result.didyoumeans
                ? `Did you mean: ${result.didyoumeans.map(d => d.val).join(", ")}?`
                : "No valid response from Wolfram Alpha.";
        }

        return result.pods?.map(pod => pod.subpods.map(subpod => subpod.plaintext).join("\n")).join("\n") || "No data found.";

    } catch (error) {
        console.error("Wolfram API Error:", error.message);
        return "Error fetching data from Wolfram Alpha.";
    }
};

/**
 * Analyzes a budget based on expenses stored in the database.
 * @param {number} budget - The total budget.
 * @param {number[]} expenses - Array of expenses.
 * @returns {Promise<Object>} - Analysis result with Wolfram insights.
 */
export const analyzeBudget = async (budget, expenses) => {
    try {
        // Validate input
        budget = Number(budget);
        expenses = expenses.map(Number);
        if (isNaN(budget) || expenses.some(isNaN)) {
            throw new Error("Invalid budget or expenses. Must be numbers.");
        }

        // Calculate spending summary
        const totalSpent = expenses.reduce((sum, expense) => sum + expense, 0);
        const remainingBudget = budget - totalSpent;
        const query = `Is a total expenditure of ${totalSpent} within a budget of ${budget}?`;

        // Fetch Wolfram Alpha response
        const wolframAnalysis = await getWolframResponse(query);

        return {
            totalSpent,
            remainingBudget,
            wolframAnalysis
        };

    } catch (error) {
        console.error("Error analyzing budget:", error.message);
        return { error: "Failed to analyze budget. Please check inputs and API key." };
    }
};
