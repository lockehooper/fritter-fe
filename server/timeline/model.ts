import { Freet } from "freet/model";
import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in an account classification
 * DO NOT implement operations here ---> use collection file
 */

export type TimelineTypes = "FEATURED" | "FOLLOWING";

// Type definition for Account Classification on the backend
export type Timeline = {
	_id: Types.ObjectId; // MongoDB assigns each object this ID on creation
	userId: Types.ObjectId;
	freets: [Types.ObjectId];
	type: string;
	dateAccessed: Date;
};

export type PopulatedTimeline = {
	_id: Types.ObjectId; // MongoDB assigns each object this ID on creation
	userId: User;
	freets: [Freet];
	type: string;
	dateAccessed: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Timelines stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const TimelineSchema = new Schema<Timeline>({
	// The userId of the account associated with the timeline
	userId: {
		// Use Types.ObjectId outside of the schema
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	// The freets associated with the timeline
	freets: {
		type: [Schema.Types.ObjectId],
		required: true,
		ref: "Freet",
	},
	// The timeline type
	type: {
		type: String,
		required: true,
	},
	// The date the timeline was last fetched
	dateAccessed: {
		type: Date,
		required: true,
	},
});

const TimelineModel = model<Timeline>("Timeline", TimelineSchema);
export default TimelineModel;
