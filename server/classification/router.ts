import type { NextFunction, Request, Response } from "express";
import express from "express";
import AccountClassificationCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as accountClassificationValidator from "./middleware";
import * as util from "./util";
import { AccountClassificationTypes } from "./model";

const router = express.Router();

/**
 * Get an account classification
 *
 * @name GET /api/classification
 *
 * @return {AccountClassification} - The account classification for the signed in user
 * @throws {403} - If the user is not logged in
 *
 */

router.get("/", [userValidator.isUserLoggedIn], async (req: Request, res: Response, next: NextFunction) => {
	const response = await AccountClassificationCollection.findOne(req.session.userId);
	res.status(200).json(util.constructClassificationResponse(response));
});

/**
 * Create a new account classification.
 *
 * @name POST /api/classification
 *
 * @param {string} validation - The validation we check to ensure integrity of action
 * @param {string} value - The value to change the account classification to
 *
 * @return {AccountClassification} - The account classification for the signed in user
 * @throws {403} - If the user is not logged in
 * @throws {400} - If validation fails
 * @throws {400} - If the user already has a classification
 */
router.post(
	"/",
	[
		userValidator.isUserLoggedIn,
		accountClassificationValidator.isValidatedChangeRequest,
		accountClassificationValidator.isExisitngClassification,
		accountClassificationValidator.isValidClassificationOption,
	],
	async (req: Request, res: Response) => {
		const userId = req.session.userId;
		const value = (req.body.value as AccountClassificationTypes) || "NONE";
		const classificaiton = await AccountClassificationCollection.addOne(userId, value);

		res.status(201).json(util.constructClassificationResponse(classificaiton));
	}
);

/**
 * Remove an accounts classification
 *
 * @name DELETE /api/classification/
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user is attempting to delete a BOT classification
 *
 */
router.delete("/", [userValidator.isUserLoggedIn], async (req: Request, res: Response) => {
	await AccountClassificationCollection.deleteOne(req.session.userId);
	res.status(200).json({
		message: "Your account status was removed.",
	});
});

/**
 * Modify an accounts classification
 *
 * @name PUT /api/classification/
 *
 * @param {string} validation - The validation we check to ensure integrity of action
 * @param {string} value - The value to change the account classification to
 *
 * @return {AccountClassification} - The account classification for the signed in user
 * @throws {403} - If the user is not logged in
 * @throws {400} - If validation fails
 * @throws {400} - If the user already has a classification
 */
router.put(
	"/",
	[
		userValidator.isUserLoggedIn,
		accountClassificationValidator.isValidatedChangeRequest,
		accountClassificationValidator.isValidClassificationOption,
	],
	async (req: Request, res: Response) => {
		const classification = await AccountClassificationCollection.updateOne(req.session.userId, req.body.value);
		res.status(200).json(util.constructClassificationResponse(classification));
	}
);

export { router as classificationRouter };
