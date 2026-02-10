import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Account } from "../models/account.model";
import { Workspace } from "../models/workspace.model";
import { Role } from "../models/roles-permission.model";
import { Roles } from "../enums/role.enums";
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from "../utils/appError";
import { Member } from "../models/member.model";
import { ProviderEnum } from "../enums/account-provider.enums";

export const loginOrCreateAccountService = async (data: {
    provider: string,
    displayName: string,
    providerId: string,
    picture?: string,
    email?: string,
}) => {
    const { provider, displayName, providerId, picture, email } = data;
    let session: mongoose.ClientSession | null = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        console.log("Started Session...");

        let user = await User.findOne({ email }).session(session);
        if (!user) {
            //create a new user if it doesn't exist
            user = new User({
                email,
                name: displayName,
                profilePicture: picture || null
            });
            await user.save({ session });
            const account = new Account({
                userId: user._id,
                provider: provider,
                providerId: providerId
            });
            await account.save({ session });

            //create a new Workspace for the new user
            const workspace = new Workspace({
                name: "My Workspace",
                description: `Workspace created for ${user.name}`,
                owner: user._id
            });
            await workspace.save({ session });

            const ownerRole = await Role.findOne({
                name: Roles.OWNER
            }).session(session);

            if (!ownerRole) {
                throw new NotFoundException("Owner role not found")
            }

            const member = new Member({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date()
            })
            await member.save({ session });

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session })
            await session.commitTransaction();
        }

        await session.endSession();
        console.log("Session ended Succesfully")

        return { user };

    } catch (error) {
        console.error("Error during Login or resgistering through google", error);
        if (session && session.inTransaction())
            await session.abortTransaction();
        if (session)
            await session.endSession();
        throw error;

    } finally {
        if (session)
            await session.endSession();
    }
}

export const registerUserService = async (body: {
    email: string,
    name: string,
    password: string
}) => {
    const { email, name, password } = body;

    let session: mongoose.ClientSession | null = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        console.log("Started Session...");

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser)
            throw new BadRequestException("Email already registered!")

        const user = new User({
            email,
            name,
            password
        });
        await user.save({ session });

        const account = new Account({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: email
        });
        await account.save({ session });

        //create a new Workspace for the new user
        const workspace = new Workspace({
            name: "My Workspace",
            description: `Workspace created for ${user.name}`,
            owner: user._id
        });
        await workspace.save({ session });

        const ownerRole = await Role.findOne({
            name: Roles.OWNER
        }).session(session);
        if (!ownerRole) {
            throw new NotFoundException("Owner role not found")
        }

        const member = new Member({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date()
        })
        await member.save({ session });

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session })
        await session.commitTransaction();


        await session.endSession();
        console.log("Session ended Succesfully")

        return {
            userId: user._id,
            workspaceId: workspace._id
        };

    } catch (error) {
        console.error("Error during Resgistering through email", error);
        if (session && session.inTransaction())
            await session.abortTransaction();
        if (session)
            await session.endSession();
        throw error;

    } finally {
        if (session)
            await session.endSession();
    }

}

export const verifyUserService = async ({
    email,
    password,
    provider = ProviderEnum.EMAIL
}: {
    email: string,
    password: string,
    provider?: string
}) => {
    const account = await Account.findOne({ provider, providerId: email });
    if (!account) {
        throw new NotFoundException("Invalid email");
    }

    const user = await User.findById(account.userId);
    if (!user) {
        throw new NotFoundException("User not found for the given account details");
    }
    const isMatchPassword = await user.comparePassword(password)
    if (!isMatchPassword) {
        throw new UnauthorizedException("Invalid Password")
    }

    return user.omitPassword()

}