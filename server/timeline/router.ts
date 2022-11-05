import type { NextFunction, Request, Response } from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import * as accountClassificationValidator from "./middleware";
import * as util from "./util";
import TimelineCollection from "./collection";
import { TimelineTypes } from "./model";

const router = express.Router();

/**
 * Get a timeline
 *
 * @name GET /api/timeline
 *
 * @param {string} type - The type of timeline to return
 *
 * @return {Freet[]} - The account classification for the signed in user
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the timeline type is invalid
 *
 */

router.get("/", [userValidator.isUserLoggedIn], async (req: Request, res: Response, next: NextFunction) => {
	const type = req.body.type as TimelineTypes;
	const updatedTimeline = await TimelineCollection.createOrUpdate(req.session.userId, type);
	const response = util.constructFreetResponse(updatedTimeline);
	res.status(200).json(response);
});

export { router as timelineRouter };
