import type { HydratedDocument, Types } from "mongoose";
import type { Event } from "./model";
import EventModel from "./model";
import UserCollection from "../user/collection";

export type EventParams = {
	name: string;
	description: string;
	start: number;
	end: number;
	freeters: string[];
};

/**
 * This files contains a class that has the functionality to explore events
 * stored in MongoDB, including adding, finding, updating, and deleting events.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Event> is the output of the EventModel() constructor,
 * and contains all the information in Event. https://mongoosejs.com/docs/typescript.html
 */
class EventCollection {
	/**
	 * Add a event to the collection
	 *
	 * @param {string} ownerId - The id of the owner of the event
	 * @param {string} params - The content of the event as different parameters
	 * @return {Promise<HydratedDocument<Event>>} - The newly created event
	 */
	static async addOne(ownerId: Types.ObjectId | string, params: EventParams): Promise<HydratedDocument<Event>> {
		const date = new Date();
		const freeters = params.freeters.length
			? await Promise.all(params.freeters.map(async (u) => await UserCollection.findOneByUserId(u)))
			: [];
		const event = new EventModel({
			ownerId,
			dateCreated: date,
			name: params.name,
			description: params.description,
			start: params.start,
			end: params.end,
			freeters: freeters.map((f) => f._id),
			dateModified: date,
		});
		await event.save(); // Saves event to MongoDB
		return (await event.populate("ownerId")).populate("freeters");
	}

	/**
	 * Find a event by eventId
	 *
	 * @param {string} eventId - The id of the event to find
	 * @return {Promise<HydratedDocument<Event>> | Promise<null> } - The event with the given eventId, if any
	 */
	static async findOne(eventId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
		return EventModel.findOne({ _id: eventId }).populate("ownerId").populate("freeters");
	}

	/**
	 * Get all the events in the database
	 *
	 * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
	 */
	static async findAll(): Promise<Array<HydratedDocument<Event>>> {
		// Retrieves events and sorts them from most to least recent
		return EventModel.find({}).sort({ dateModified: -1 }).populate("ownerId").populate("freeters");
	}

	/**
	 * Get all the events in by given owner
	 *
	 * @param {string} username - The username of owner of the events
	 * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
	 */
	static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Event>>> {
		const owner = await UserCollection.findOneByUsername(username);
		return EventModel.find({ ownerId: owner._id }).populate("ownerId").populate("freeters");
	}

	/**
	 * Update a event with the new content
	 *
	 * @param {string} eventId - The id of the event to be updated
	 * @param {string} params - The content of the event as different parameters
	 * @return {Promise<HydratedDocument<Event>>} - The newly updated event
	 */
	static async updateOne(
		eventId: Types.ObjectId | string,
		params: Partial<EventParams>
	): Promise<HydratedDocument<Event>> {
		const { name, description, start, end, freeters } = params;
		const event = await EventModel.findOne({ _id: eventId });

		if (name) {
			event.name = name;
		}

		if (description) {
			event.description = description;
		}

		if (start) {
			event.start = start;
		}

		if (end) {
			event.end = end;
		}

		if (freeters) {
			const newFreeters = await Promise.all(
				params.freeters.map(async (u) => await UserCollection.findOneByUserId(u))
			);
			event.freeters = newFreeters.map((f) => f._id) as [Types.ObjectId];
		}

		event.dateModified = new Date();
		await event.save();
		return (await event.populate("ownerId")).populate("freeters");
	}

	/**
	 * Delete a event with given eventId.
	 *
	 * @param {string} eventId - The eventId of event to delete
	 * @return {Promise<Boolean>} - true if the event has been deleted, false otherwise
	 */
	static async deleteOne(eventId: Types.ObjectId | string): Promise<boolean> {
		const event = await EventModel.deleteOne({ _id: eventId });
		return event !== null;
	}

	/**
	 * Delete all the events by the given owner
	 *
	 * @param {string} ownerId - The id of owner of events
	 */
	static async deleteMany(ownerId: Types.ObjectId | string): Promise<void> {
		await EventModel.deleteMany({ ownerId });
	}
}

export default EventCollection;
