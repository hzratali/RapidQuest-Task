import express from "express";
import {
  getTotalSalesOverTime,
  getNewCustomersOverTime,
  getSalesGrowthRate,
  getRepeatedCustomers,
  getGeographicalDistribution,
  getCLTVByCohorts,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/sales-over-time", getTotalSalesOverTime);
router.get("/new-customers-over-time", getNewCustomersOverTime);
router.get("/sales-growth", getSalesGrowthRate);
router.get("/repeated-customers", getRepeatedCustomers);
router.get("/geographical-distribution", getGeographicalDistribution);
router.get("/customer-lifetime-value", getCLTVByCohorts);

export default router;
