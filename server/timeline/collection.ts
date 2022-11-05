import type { HydratedDocument, Types } from "mongoose";
import type { Timeline, TimelineTypes } from "./model";
import TimelineModel from "./model";
import { getFreetIds } from "./util";

/**
 * This files contains a class that has the functionality to explore and interact with
 * timelines
 */
class TimelineCollection {
	/**
	 * Add a classification to the collection
	 *
	 * @param {string} userId - The id of the userassociated with the account
	 * @param {TimelineTypes} type - The timeline type
	 * @return {Promise<HydratedDocument<Timeline>>} - The newly created timeline
	 */
	static async addOne(userId: Types.ObjectId | string, type: TimelineTypes): Promise<HydratedDocument<Timeline>> {
		const date = new Date();
		const timeline = new TimelineModel({
			userId: userId,
			type: type,
			freets: await getFreetIds(type, userId),
			dateAccessed: date,
		});
		await timeline.save(); // Saves to MongoDB
		return (await timeline.populate("userId")).populate("freets");
	}

	/**
	 * Find a classification by userId
	 *
	 * @param {string} userId - The user id of the account which classification we want to find
	 * @return {Promise<HydratedDocument<Timeline>> | Promise<null> }
	 */
	static async findOne(userId: Types.ObjectId | string, type: string): Promise<HydratedDocument<Timeline>> {
		return TimelineModel.findOne({ userId: userId, type: type }).populate("userId").populate("freets");
	}

	/**
	 * Update a timeline with a new dateAccessed
	 *
	 * @param {string} userId - The id of the user whose account needs to be updated
	 * @param {TimelineTypes} type - The type of the timeline to update
	 * @return {Promise<HydratedDocument<Timeline>>} - The newly updated timeline
	 */
	static async updateOne(userId: Types.ObjectId | string, type: TimelineTypes): Promise<HydratedDocument<Timeline>> {
		const timeline = await TimelineModel.findOne({ userId: userId, type: type });
		timeline.freets = await getFreetIds(type, timeline.userId);
		timeline.dateAccessed = new Date();
		await timeline.save();
		return (await timeline.populate("userId")).populate("freets");
	}

	/**
	 * Creates a timeline if it doesn't exists or updates an existing one
	 *
	 * @param {string} userId - The id of the user whose account needs to be updated
	 * @param {TimelineTypes} type - The type of the timeline to update
	 * @return {Promise<HydratedDocument<Timeline>>} - The newly updated timeline
	 */
	static async createOrUpdate(
		userId: Types.ObjectId | string,
		type: TimelineTypes
	): Promise<HydratedDocument<Timeline>> {
		const exisitingTimeline = await this.findOne(userId, type);
		if (exisitingTimeline === null) {
			return this.addOne(userId, type);
		} else {
			return this.updateOne(userId, type);
		}
	}

	/**
	 * Delete a timeline for a given type and userId.
	 *
	 * @param {string} userId - The userId of timeline to delete
	 * @param {string} type - The type of timeline to delete
	 * @return {Promise<Boolean>} - true if the timeline has been deleted, false otherwise
	 */
	static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
		const timeline = await TimelineModel.deleteOne({ userId: userId });
		return timeline !== null;
	}
}

export default TimelineCollection;
