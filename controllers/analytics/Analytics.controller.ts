import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Visit } from "../../models/analytics/Visit.model";

class AnalyticsController {
  // Record a simple pageview (no personal data)
  recordVisit = asyncHandler(async (req: Request, res: Response) => {
    try {
      const created = await Visit.create({});
      res.status(201).json({ message: "visit recorded" });
      return;
    } catch (err) {
      res.status(500).json({ message: "failed to record visit" });
      return;
    }
  });

  // Get weekly pageviews counts: ?weeks=N (default 6)
  getWeeklyUniqueVisitors = asyncHandler(
    async (req: Request, res: Response) => {
      const weeks = Math.max(1, parseInt(String(req.query.weeks || "6")) || 6);
      const now = new Date();
      // start from Monday of current week (UTC)
      const utcYear = now.getUTCFullYear();
      const utcMonth = now.getUTCMonth();
      const utcDate = now.getUTCDate();
      const dow = now.getUTCDay();
      const deltaToMonday = dow === 0 ? 6 : dow - 1;
      const currentWeekMonday = new Date(
        Date.UTC(utcYear, utcMonth, utcDate - deltaToMonday, 0, 0, 0, 0)
      );

      const start = new Date(currentWeekMonday);
      start.setUTCDate(currentWeekMonday.getUTCDate() - (weeks - 1) * 7);


      // Aggregate pageviews per week (count)
      const results = await Visit.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
          $group: {
            _id: {
              $dateTrunc: {
                date: "$createdAt",
                unit: "week",
                timezone: "+00:00",
                startOfWeek: "monday",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            weekStart: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$_id",
                timezone: "+00:00",
              },
            },
            count: 1,
          },
        },
        { $sort: { weekStart: 1 } },
      ]);

      // Build labels for each week
      const labels: string[] = [];
      for (let i = 0; i < weeks; i++) {
        const d = new Date(start);
        d.setUTCDate(start.getUTCDate() + i * 7);
        labels.push(d.toISOString().slice(0, 10));
      }

      const map: Record<string, number> = {};
      results.forEach((r: any) => (map[r.weekStart] = r.count));

      const data = labels.map((l) => map[l] || 0);

      res.status(200).json({ labels, data });
    }
  );
}

export default new AnalyticsController();
