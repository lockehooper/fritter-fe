import { Freet } from "freet/model";
import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in an event
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Event on the backend
export type Event = {
	_id: Types.ObjectId; // MongoDB assigns each object this ID on creation
	name: string;
	description: string;
	start: number;
	end: number;
	ownerId: Types.ObjectId;
	freeters: [Types.ObjectId];
	dateCreated: Date;
	dateModified: Date;
};

export type PopulatedEvent = {
	_id: Types.ObjectId; // MongoDB assigns each object this ID on creation
	name: string;
	description: string;
	start: number;
	end: number;
	ownerId: User;
	freeters: [User];
	dateCreated: Date;
	dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Events stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const EventSchema = new Schema<Event>({
	// The userId of the creator/owner of the event
	ownerId: {
		// Use Types.ObjectId outside of the schema
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	// The freeters associated with the timeline
	freeters: {
		type: [Schema.Types.ObjectId],
		required: true,
		ref: "User",
	},
	// The event name
	name: {
		type: String,
		required: true,
	},
	// The event description
	description: {
		type: String,
		required: true,
	},
	// The timestamp of the event start
	start: {
		type: Number,
		required: true,
	},
	// The timestamp of the event end
	end: {
		type: Number,
		required: true,
	},
	// The date the event was created
	dateCreated: {
		type: Date,
		required: true,
	},
	// The date the event was last modified
	dateModified: {
		type: Date,
		required: true,
	},
});

const EventModel = model<Event>("Event", EventSchema);
export default EventModel;
