import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    websiteUrl: { type: String, required: true },
    figmaId: { type: String, required: true },
    output: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);