import FreetCollection from "../freet/collection";
import { Freet } from "../freet/model";
import moment from "moment";
import { HydratedDocument, Types } from "mongoose";
import UserCollection from "../user/collection";
import { PopulatedTimeline, Timeline, TimelineTypes } from "./model";
import { FreetResponse } from "server/freet/util";

// Update this if you add a property to the Freet type!
type TimelineResponse = {
	_id: string;
	freets: FreetResponse[];
	dateAccessed: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 * Transform a raw Timeline object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Timeline>} timeline - A timeline
 * @returns {TimelineResponse} - The timeline object formatted for the frontend
 */
const constructFreetResponse = (timeline: HydratedDocument<Timeline>): TimelineResponse => {
	const timelineCopy: PopulatedTimeline = {
		...timeline.toObject({
			versionKey: false, // Cosmetics; prevents returning of __v property
		}),
	};

	const formatFreets: FreetResponse[] = timelineCopy.freets.map((f) => {
		const { username } = f.authorId;
		return {
			_id: f._id.toString(),
			content: f.content,
			author: username,
			dateCreated: formatDate(f.dateCreated),
			dateModified: formatDate(f.dateModified),
		};
	});

	return {
		_id: timelineCopy._id.toString(),
		freets: formatFreets,
		dateAccessed: formatDate(timeline.dateAccessed),
	};
};

const getFreetIds = async (type: TimelineTypes, userId: Types.ObjectId | string): Promise<[Types.ObjectId]> => {
	const timelineUser = await UserCollection.findOneByUserId(userId);
	if (type === "FOLLOWING") {
		let freetIdArray: Types.ObjectId[] = [];
		await Promise.all(
			timelineUser.following.map(async (u) => {
				const userFreets = await FreetCollection.findAllByUsername(u);
				userFreets.forEach((f) => freetIdArray.push(f._id));
			})
		);
		return freetIdArray as [Types.ObjectId];
	} else {
		return (await FreetCollection.findAll()).slice(0, 100).map((f) => f._id) as [Types.ObjectId];
	}
};

export { constructFreetResponse, getFreetIds };
