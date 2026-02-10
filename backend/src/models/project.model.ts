import mongoose, { Document, Schema } from "mongoose";

export interface ProjectDocument extends Document {
    name: string;
    description: string;
    emoji: string;
    workspace: mongoose.Types.ObjectId;
    allowedMembers: [mongoose.Types.ObjectId]
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    emoji: {
        type: String,
        trim: true,
        default: "📝",
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    allowedMembers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });


projectSchema.index({ workspace: 1, allowedMembers: 1 });
projectSchema.index({ workspace: 1, createdAt: -1 });

export const Project = mongoose.model<ProjectDocument>("Project", projectSchema);