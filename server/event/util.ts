import FreetCollection from "../freet/collection";
import { constructFreetResponse, FreetResponse } from "../freet/util";
import moment from "moment";
import { HydratedDocument, Types } from "mongoose";
import { PopulatedEvent, Event } from "./model";

// Update this if you add a property to the Freet type!
export type EventResponse = {
	_id: string;
	owner: string;
	name: string;
	description: string;
	start: number;
	end: number;
	freeters: string[];
	freets: FreetResponse[];
	dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 * Transform a raw Event object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Timeline>} timeline - A timeline
 * @returns {EventResponse} - The event object formatted for the frontend
 */
const constructEventResponse = async (event: HydratedDocument<Event>): Promise<EventResponse> => {
	const eventCopy: PopulatedEvent = {
		...event.toObject({
			versionKey: false, // Cosmetics; prevents returning of __v property
		}),
	};

	const eventFreets = await Promise.all(
		eventCopy.freeters
			.map(async (freeter) => {
				const userFreets = await FreetCollection.findAllByUsername(freeter.username);
				return userFreets;
			})
			.map(async (freetResp) => {
				const awaitedFreetresp = await freetResp;
				return awaitedFreetresp.map((f) => constructFreetResponse(f));
			})
	);

	return {
		_id: event._id.toString(),
		owner: event.ownerId.toString(),
		freeters: event.freeters.map((f) => f.toString()),
		name: event.name,
		description: event.description,
		start: event.start,
		end: event.end,
		freets: eventFreets.flat(),
		dateModified: formatDate(event.dateModified),
	};
};

export { constructEventResponse };
