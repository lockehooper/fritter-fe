import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in an account classification
 * DO NOT implement operations here ---> use collection file
 */

export type AccountClassificationTypes = "BOT" | "HUMAN" | "VERIFIED" | "NONE";

// Type definition for Account Classification on the backend
export type AccountClassification = {
	_id: Types.ObjectId; // MongoDB assigns each object this ID on creation
	userId: Types.ObjectId;
	type: AccountClassificationTypes;
	dateModified: Date;
};

export type PopulatedAccountClassification = {
	_id: Types.ObjectId; // MongoDB assigns each object this ID on creation
	userId: User;
	type: AccountClassificationTypes;
	dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Classifications stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AccountClassificationSchema = new Schema<AccountClassification>({
	// The userId of the account associated with the classification
	userId: {
		// Use Types.ObjectId outside of the schema
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	// The account classification type
	type: {
		type: String,
		required: true,
	},
	// The date the account classification was last modified
	dateModified: {
		type: Date,
		required: true,
	},
});

const AccountClassificationModel = model<AccountClassification>("AccountClassification", AccountClassificationSchema);
export default AccountClassificationModel;
