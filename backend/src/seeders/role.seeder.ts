import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import { Role } from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async () => {

    console.log("Seeding roles started");
    let session: mongoose.ClientSession | null = null;

    try {
        await connectDatabase();

        session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles...");
        await Role.deleteMany({}, { session });

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];

            //Check if the role already exists
            const existingRole = await Role.findOne({ name: role }).session(session);
            if (!existingRole) {
                const newRole = new Role({
                    name: role,
                    permissions: permissions
                });
                await newRole.save({ session });
                console.log(`Role ${role} added with permissions.`)
            }
            else {
                console.log(`Role ${role} already exists with permissions.`)
            }
        }

        await session.commitTransaction();
        console.log("Transaction commited");

        await session.endSession();
        console.log("Seeding completed succesfully");
    } catch (error) {
        console.error("Error during Seeding", error);
        if (session && session.inTransaction())
            await session.abortTransaction();

    } finally {
        if (session)
            await session.endSession();
        console.log("Session Ended");
    }
};

seedRoles().catch((error) => console.error("Error runing seed script", error));
