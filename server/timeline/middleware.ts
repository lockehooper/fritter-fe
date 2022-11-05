import type { Request, Response, NextFunction } from "express";
import { TimelineTypes } from "./model";

/**
 * Checks if the timeline type requested is a valid option
 */
const isValidTimelineOption = async (req: Request, res: Response, next: NextFunction) => {
	const type = req.params.type as TimelineTypes;
	if (!type) {
		res.status(400).json({
			error: "Bad type in request",
		});
		return;
	}

	next();
};

export { isValidTimelineOption };
