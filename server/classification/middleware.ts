import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import AccountClassificationCollection from "./collection";
import FreetCollection from "./collection";
import { AccountClassificationTypes } from "./model";

/**
 * Checks the validation field given back to the backend to make sure that the
 * request to change the classification status is coming only after a Captcha
 * like service has given shown the user is valid.
 */
const isValidatedChangeRequest = (req: Request, res: Response, next: NextFunction) => {
	const { validation } = req.body as { validation: string };
	const isValid = validation == "SOME_CAPTCHA";
	if (!isValid) {
		res.status(403).json({
			error: "Bad validation",
		});
		return;
	}

	next();
};

/**
 * Checks if the classification requested is a valid option
 */
const isValidClassificationOption = async (req: Request, res: Response, next: NextFunction) => {
	const value = req.body.value as AccountClassificationTypes;
	if (!value.length) {
		res.status(400).json({
			error: "Bad value in request",
		});
		return;
	}

	next();
};

/**
 * Checks if the use has a classification
 */
const isExisitngClassification = async (req: Request, res: Response, next: NextFunction) => {
	const classificaiton = await AccountClassificationCollection.findOne(req.session.userId);
	if (classificaiton) {
		res.status(400).json({
			error: "Classification already exists",
		});
		return;
	}

	next();
};

/**
 * Checks if the current user account classification can be deleted
 */
const isValidDeleteType = async (req: Request, res: Response, next: NextFunction) => {
	const classificaiton = await AccountClassificationCollection.findOne(req.session.userId);
	if (classificaiton.type === "BOT") {
		res.status(403).json({
			error: "Cannot remove bot classification",
		});
		return;
	}

	next();
};

export { isExisitngClassification, isValidClassificationOption, isValidatedChangeRequest, isValidDeleteType };
