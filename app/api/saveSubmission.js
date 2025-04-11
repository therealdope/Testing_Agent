import dbConnect from "../../utils/dbConnect";
import Submission from "../../models/Submission";


export default async function handler(req, res) {
    if (req.method === "POST") {
        await dbConnect();

        const { userId, url, figmaId, output } = req.body;

        try {
            const newSubmission = new Submission({
                userId,
                url, // Now using "url" instead of "githubUrl"
                figmaId,
                output,
            });

            await newSubmission.save();
            res.status(201).json({ message: "Submission saved successfully", newSubmission });
        } catch (error) {
            res.status(500).json({ error: "Failed to save submission" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}