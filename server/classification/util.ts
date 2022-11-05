import moment from "moment";
import type { HydratedDocument } from "mongoose";
import { AccountClassification, PopulatedAccountClassification } from "./model";

// Update this if you add a property to the User type!
export type AccountClassificationResponse = {
	_id: string;
	type: string;
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
 * Transform a raw AccountClassification object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Timeline>} timeline - A timeline
 * @returns {AccountClassificationResponse} - The event object formatted for the frontend
 */
const constructClassificationResponse = (
	classification: HydratedDocument<AccountClassification> | null
): AccountClassificationResponse => {
	if (classification === null) {
		return {
			_id: "",
			type: "NONE",
			dateModified: "",
		};
	}
	const classificaitonCopy: AccountClassification = {
		...classification.toObject({
			versionKey: false, // Cosmetics; prevents returning of __v property
		}),
	};

	return {
		...classificaitonCopy,
		_id: classificaitonCopy._id.toString(),
		dateModified: formatDate(classification.dateModified),
	};
};

export { constructClassificationResponse };
