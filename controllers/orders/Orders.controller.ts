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
      const contractors = await User.countDocuments({ role: "contractor" })
      const recourses = await User.countDocuments({ role: "recourse" })
      const interings = await User.countDocuments({ role: "intering" })

      const materials = await Material.countDocuments();

      res.status(200).json({
        financeOrder: resultOfFinanceOrder,
        materialOrder: resultOfMaterialOrder,
        recourseOrder: reusltOfRecourse,
        rehabilitationOrder: resultOfRehabilitation,
        materials: materials,
        contractors,
        recourses,
        interings
      });
    }
  );
}

export default new OrderController();
