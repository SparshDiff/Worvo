import mongoose, { Document, Schema } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider.enums";

export interface AccountDocument extends Document {
    userId: mongoose.Types.ObjectId;
    provider: ProviderEnumType;
    providerId: string;//Store the email,googleId,MicrosoftId based on provider
    refreshToken: string | null;
    refreshTokenExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const accountSchema = new Schema<AccountDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        provider: {
            type: String,
            enum: Object.values(ProviderEnum),
            required: true
        },
        providerId: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            default: null
        },
        refreshTokenExpires: {
            type: Date,
            default: null
        }
    }, {
    timestamps: true, toJSON: {
        transform: (doc, ret) => {
            delete ret.refreshToken
        }
    }
})

// Indexing based on Provider
accountSchema.index(
    { provider: 1, providerId: 1 },
    { unique: true }
);


export const Account = mongoose.model<AccountDocument>("Account", accountSchema);
