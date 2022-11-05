import type { NextFunction, Request, Response } from "express";
import express from "express";
import EventCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as eventValidator from "../event/middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Get all the events
 *
 * @name GET /api/events
 *
 * @return {EventResponse[]} - A list of all the events sorted in descending
 *                      order by date modified
 */
/**
 * Get events by author.
 *
 * @name GET /api/events?authorId=id
 *
 * @return {EventResponse[]} - An array of events created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
	"/",
	async (req: Request, res: Response, next: NextFunction) => {
		// Check if authorId query parameter was supplied
		if (req.query.author !== undefined) {
			next();
			return;
		}

		const allEvents = await EventCollection.findAll();
		const response = await Promise.all(allEvents.map(util.constructEventResponse));
		res.status(200).json(response);
	},
	[userValidator.isAuthorExists],
	async (req: Request, res: Response) => {
		const authorEvents = await EventCollection.findAllByUsername(req.query.author as string);
		const response = await Promise.all(authorEvents.map(util.constructEventResponse));
		res.status(200).json(response);
	}
);

/**
 * Create a new event.
 *
 * @name POST /api/events
 *
 * @param {string} name - The name of the event
 * @param {string} description - The description of the event
 * @param {string} start - The start timestamp of the event
 * @param {string} end - The end timestamp of the event
 * @param {string} freeters - The userIds whose freets should be in the event
 *
 * @return {EventResponse} - The created event
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the event content does not have a name or description
 */
router.post(
	"/",
	[userValidator.isUserLoggedIn, eventValidator.isValidEventContent, eventValidator.isValidEventCreator],
	async (req: Request, res: Response) => {
		const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
		const params = {
			name: req.body.name,
			description: req.body.description,
			start: parseInt(req.body.start),
			end: parseInt(req.body.end),
			freeters: req.body.freeters.split(","),
		};
		const event = await EventCollection.addOne(userId, params);

		res.status(201).json({
			message: "Your event was created successfully.",
			event: await util.constructEventResponse(event),
		});
	}
);

/**
 * Delete a event
 *
 * @name DELETE /api/events/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the event
 * @throws {404} - If the eventId is not valid
 */
router.delete(
	"/:eventId?",
	[userValidator.isUserLoggedIn, eventValidator.isEventExists, eventValidator.isValidEventModifier],
	async (req: Request, res: Response) => {
		await EventCollection.deleteOne(req.params.eventId);
		res.status(200).json({
			message: "Your event was deleted successfully.",
		});
	}
);

/**
 * Modify a event
 *
 * @name PUT /api/events/:id
 *
 * @param {string} name - The name of the event
 * @param {string} description - The description of the event
 * @param {string} start - The start timestamp of the event
 * @param {string} end - The end timestamp of the event
 * @param {string} freeters - The userIds whose freets should be in the event
 *
 * @return {EventResponse} - the updated event
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the event
 * @throws {404} - If the eventId is not valid
 */
router.put(
	"/:eventId?",
	[
		userValidator.isUserLoggedIn,
		eventValidator.isEventExists,
		eventValidator.isValidEventModifier,
		eventValidator.isValidEventContent,
	],
	async (req: Request, res: Response) => {
		const params = {
			name: req.body.name,
			description: req.body.description,
			start: parseInt(req.body.start),
			end: parseInt(req.body.end),
			freeters: req.body.freeters as string[],
		};
		const event = await EventCollection.updateOne(req.params.eventId, params);
		res.status(200).json({
			message: "Your event was updated successfully.",
			event: await util.constructEventResponse(event),
		});
	}
);

export { router as eventRouter };
