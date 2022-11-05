import AccountClassificationCollection from "../classification/collection";
import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import EventCollection from "./collection";

/**
 * Checks if a user can create events
 */
const isValidEventCreator = async (req: Request, res: Response, next: NextFunction) => {
	const userClassification = await AccountClassificationCollection.findOne(req.session.userId);
	if (userClassification.type !== "VERIFIED") {
		res.status(403).json({
			error: "You must be verified to create events",
		});
		return;
	}

	next();
};

/**
 * Checks if a user can modify an event
 */
const isValidEventModifier = async (req: Request, res: Response, next: NextFunction) => {
	const event = await EventCollection.findOne(req.params.eventId);
	const userId = event.ownerId._id;
	if (req.session.userId !== userId.toString()) {
		res.status(403).json({
			error: "Cannot modify other users' events.",
		});
		return;
	}

	next();
};

/**
 * Checks if an events content is valid
 */
const isValidEventContent = async (req: Request, res: Response, next: NextFunction) => {
	const { start, end, name, description } = req.body;
	const oldEvent = await EventCollection.findOne(req.params.freetId);

	const startToCheck = start ? parseInt(start) : oldEvent.start;
	const endToCheck = end ? parseInt(end) : oldEvent.end;

	if (startToCheck >= endToCheck) {
		res.status(400).json({
			error: "Events must end after they start",
		});
		return;
	}

	if ((name && !name.length) || (description && !description.length)) {
		res.status(400).json({
			error: "Events must have a name and description",
		});
		return;
	}

	next();
};

/**
 * Checks if a event with eventId is req.params exists
 */
const isEventExists = async (req: Request, res: Response, next: NextFunction) => {
	const validFormat = Types.ObjectId.isValid(req.params.freetId);
	const freet = validFormat ? await EventCollection.findOne(req.params.freetId) : "";
	if (!freet) {
		res.status(404).json({
			error: {
				freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`,
			},
		});
		return;
	}

	next();
};

export { isValidEventContent, isEventExists, isValidEventCreator, isValidEventModifier };
