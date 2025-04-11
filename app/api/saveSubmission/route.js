import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Submission from "@/models/Submission";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await dbConnect();

        // Verify user authentication
        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const body = await req.json();
        const { websiteUrl, figmaId, output } = body;

        if (!websiteUrl || !figmaId || !output) {
            return NextResponse.json({ 
                error: "Website URL, Figma ID, and output are required" 
            }, { status: 400 });
        }

        const newSubmission = new Submission({
            userId,
            websiteUrl,
            figmaId,
            output: JSON.stringify(output)
        });

        await newSubmission.save();
        return NextResponse.json({ 
            success: true, 
            message: "Submission saved successfully",
            submission: newSubmission 
        });
    } catch (error) {
        console.error('Save submission error:', error);
        return NextResponse.json({ 
            error: "Failed to save submission" 
        }, { status: 500 });
    }
}