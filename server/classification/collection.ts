import type { HydratedDocument, Types } from "mongoose";
import type { AccountClassification, AccountClassificationTypes } from "./model";
import AccountClassificationModel from "./model";

/**
 * This files contains a class that has the functionality to explore and interact with
 * account classifications
 */
class AccountClassificationCollection {
	/**
	 * Add a classification to the collection
	 *
	 * @param {string} userId - The id of the userassociated with the account
	 * @param {AccountClassificationTypes} type - The classificaiton type
	 * @return {Promise<HydratedDocument<AccountClassification>>} - The newly created account classification
	 */
	static async addOne(
		userId: Types.ObjectId | string,
		type: AccountClassificationTypes
	): Promise<HydratedDocument<AccountClassification>> {
		const date = new Date();
		const classification = new AccountClassificationModel({
			userId: userId,
			type: type,
			dateModified: date,
		});
		await classification.save(); // Saves to MongoDB
		return classification.populate("userId");
	}

	/**
	 * Find a classification by userId
	 *
	 * @param {string} userId - The user id of the account which classification we want to find
	 * @return {Promise<HydratedDocument<AccountClassification>> | Promise<null> }
	 */
	static async findOne(userId: Types.ObjectId | string): Promise<HydratedDocument<AccountClassification>> {
		return AccountClassificationModel.findOne({ userId: userId }).populate("userId");
	}

	/**
	 * Update an account classificaiton with the new type
	 *
	 * @param {string} userId - The id of the user whose account needs to be updated
	 * @param {AccountClassificationTypes} type - The new type of the account
	 * @return {Promise<HydratedDocument<AccountClassification>>} - The newly updated classification
	 */
	static async updateOne(
		userId: Types.ObjectId | string,
		type: AccountClassificationTypes
	): Promise<HydratedDocument<AccountClassification>> {
		const classification = await AccountClassificationModel.findOne({ userId: userId });
		classification.type = type;
		classification.dateModified = new Date();
		await classification.save();
		return classification.populate("userId");
	}

	/**
	 * Delete a classification for a given userId.
	 *
	 * @param {string} userId - The userId of classification to delete
	 * @return {Promise<Boolean>} - true if the classification has been deleted, false otherwise
	 */
	static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
		const classificaiton = await AccountClassificationModel.deleteOne({ userId: userId });
		return classificaiton !== null;
	}
}

export default AccountClassificationCollection;
