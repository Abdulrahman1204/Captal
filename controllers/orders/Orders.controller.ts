import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Finance } from "../../models/orders/finance/Finance.model";
import { MaterialOrder } from "../../models/orders/material/Material.model";
import { RecourseOrder } from "../../models/orders/recourse/Recourse.model";
import { Qualification } from "../../models/orders/rehabilitation/Rehabilitation.Model";
import { Material } from "../../models/materials/Material.model";
import { User } from "../../models/users/User.model";

class OrderController {
  getTheCountOfOrder = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const resultOfFinanceOrder = await Finance.countDocuments();
      const resultOfMaterialOrder = await MaterialOrder.countDocuments();
      const reusltOfRecourse = await RecourseOrder.countDocuments();
      const resultOfRehabilitation = await Qualification.countDocuments();
      const contractors = await User.countDocuments({ role: "contractor" });
      const recourses = await User.countDocuments({ role: "recourse" });
      const interings = await User.countDocuments({ role: "intering" });

      const materials = await Material.countDocuments();

      res.status(200).json({
        financeOrder: resultOfFinanceOrder,
        materialOrder: resultOfMaterialOrder,
        recourseOrder: reusltOfRecourse,
        rehabilitationOrder: resultOfRehabilitation,
        materials: materials,
        contractors,
        recourses,
        interings,
      });
    }
  );

  // Get weekly chart data: counts per day for last 7 days for each order type
  getWeeklyOrdersChart = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const now = new Date();

      // Read grouping params: group=day|week; for week use ?weeks=N (default 6)
      const groupBy = String(req.query.group || "day").toLowerCase();
      const weeks = Math.max(1, parseInt(String(req.query.weeks || "6")) || 6);

      // Compute start in UTC depending on grouping
      let start: Date;
      if (groupBy === "week") {
        // find start of current week (Monday) in UTC
        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();
        const dow = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
        const deltaToMonday = dow === 0 ? 6 : dow - 1; // days since Monday
        const currentWeekMonday = new Date(
          Date.UTC(utcYear, utcMonth, utcDate - deltaToMonday, 0, 0, 0, 0)
        );
        // start from earliest week (weeks count)
        start = new Date(currentWeekMonday);
        start.setUTCDate(currentWeekMonday.getUTCDate() - (weeks - 1) * 7);
      } else {
        // default: daily for last 7 days
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - 6,
            0,
            0,
            0,
            0
          )
        );
      }

      // Helper to aggregate counts per day for a model
      const aggregateByDay = async (model: any) => {
        const results = await model.aggregate([
          { $match: { createdAt: { $gte: start } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "+00:00",
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);

        // Map results to a dictionary for quick lookup
        const map: Record<string, number> = {};
        results.forEach((r: any) => (map[r._id] = r.count));
        return map;
      };

      // Helper to aggregate counts per week for a model (week buckets, UTC)
      const aggregateByWeek = async (model: any) => {
        const results = await model.aggregate([
          { $match: { createdAt: { $gte: start } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: {
                    $dateTrunc: {
                      date: "$createdAt",
                      unit: "week",
                      timezone: "+00:00",
                      startOfWeek: "monday",
                    },
                  },
                  timezone: "+00:00",
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);

        const map: Record<string, number> = {};
        results.forEach((r: any) => (map[r._id] = r.count));
        return map;
      };

      let financeMap: Record<string, number>;
      let materialMap: Record<string, number>;
      let recourseMap: Record<string, number>;
      let rehabMap: Record<string, number>;
      const labels: string[] = [];

      if (groupBy === "week") {
        [financeMap, materialMap, recourseMap, rehabMap] = await Promise.all([
          aggregateByWeek(Finance),
          aggregateByWeek(MaterialOrder),
          aggregateByWeek(RecourseOrder),
          aggregateByWeek(Qualification),
        ]);

        // Build week labels starting from `start`, increment by 7 days
        for (let i = 0; i < weeks; i++) {
          const d = new Date(start);
          d.setUTCDate(start.getUTCDate() + i * 7);
          labels.push(d.toISOString().slice(0, 10));
        }
      } else {
        [financeMap, materialMap, recourseMap, rehabMap] = await Promise.all([
          aggregateByDay(Finance),
          aggregateByDay(MaterialOrder),
          aggregateByDay(RecourseOrder),
          aggregateByDay(Qualification),
        ]);

        // Build labels for the last 7 days
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setUTCDate(start.getUTCDate() + i);
          labels.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
        }
      }

      const financeData = labels.map((l) => financeMap[l] || 0);
      const materialData = labels.map((l) => materialMap[l] || 0);
      const recourseData = labels.map((l) => recourseMap[l] || 0);
      const rehabData = labels.map((l) => rehabMap[l] || 0);

      res.status(200).json({
        labels,
        datasets: {
          finance: financeData,
          material: materialData,
          recourse: recourseData,
          rehabilitation: rehabData,
        },
      });
    }
  );

  // Get visits chart: counts of orders with statusUser === 'visited'
  getVisitsChart = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const now = new Date();

      // Read grouping params: group=day|week; for week use ?weeks=N (default 6)
      const groupBy = String(req.query.group || "day").toLowerCase();
      const weeks = Math.max(1, parseInt(String(req.query.weeks || "6")) || 6);

      // Compute start in UTC depending on grouping
      let start: Date;
      if (groupBy === "week") {
        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();
        const dow = now.getUTCDay();
        const deltaToMonday = dow === 0 ? 6 : dow - 1;
        const currentWeekMonday = new Date(
          Date.UTC(utcYear, utcMonth, utcDate - deltaToMonday, 0, 0, 0, 0)
        );
        start = new Date(currentWeekMonday);
        start.setUTCDate(currentWeekMonday.getUTCDate() - (weeks - 1) * 7);
      } else {
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - 6,
            0,
            0,
            0,
            0
          )
        );
      }

      // Aggregate helper for visits (statusUser === 'visited')
      const aggregateBy = async (model: any, mode: "day" | "week") => {
        if (mode === "week") {
          const results = await model.aggregate([
            { $match: { createdAt: { $gte: start }, statusUser: "visited" } },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: {
                      $dateTrunc: {
                        date: "$createdAt",
                        unit: "week",
                        timezone: "+00:00",
                        startOfWeek: "monday",
                      },
                    },
                    timezone: "+00:00",
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]);
          const map: Record<string, number> = {};
          results.forEach((r: any) => (map[r._id] = r.count));
          return map;
        }

        const results = await model.aggregate([
          { $match: { createdAt: { $gte: start }, statusUser: "visited" } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "+00:00",
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        const map: Record<string, number> = {};
        results.forEach((r: any) => (map[r._id] = r.count));
        return map;
      };

      // choose aggregation method
      const isWeek = groupBy === "week";
      const [financeMap, materialMap, recourseMap, rehabMap] =
        await Promise.all([
          aggregateBy(Finance, isWeek ? "week" : "day"),
          aggregateBy(MaterialOrder, isWeek ? "week" : "day"),
          aggregateBy(RecourseOrder, isWeek ? "week" : "day"),
          aggregateBy(Qualification, isWeek ? "week" : "day"),
        ]);

      const labels: string[] = [];
      if (isWeek) {
        for (let i = 0; i < weeks; i++) {
          const d = new Date(start);
          d.setUTCDate(start.getUTCDate() + i * 7);
          labels.push(d.toISOString().slice(0, 10));
        }
      } else {
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setUTCDate(start.getUTCDate() + i);
          labels.push(d.toISOString().slice(0, 10));
        }
      }

      const financeData = labels.map((l) => financeMap[l] || 0);
      const materialData = labels.map((l) => materialMap[l] || 0);
      const recourseData = labels.map((l) => recourseMap[l] || 0);
      const rehabData = labels.map((l) => rehabMap[l] || 0);

      // total visits per label
      const total = labels.map(
        (_, idx) =>
          financeData[idx] +
          materialData[idx] +
          recourseData[idx] +
          rehabData[idx]
      );

      res.status(200).json({
        labels,
        datasets: {
          finance: financeData,
          material: materialData,
          recourse: recourseData,
          rehabilitation: rehabData,
          total,
        },
      });
    }
  );
}

export default new OrderController();
