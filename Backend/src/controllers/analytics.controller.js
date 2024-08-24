import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import connectDB from "../db/db.js";

const getGroupByInterval = (interval) => {
  switch (interval) {
    case "monthly":
      return { $dateToString: { format: "%Y-%m", date: "$created_at" } };
    case "quarterly":
      return {
        $concat: [
          { $substr: [{ $year: "$created_at" }, 0, 4] },
          "-Q",
          {
            $substr: [
              { $add: [{ $divide: [{ $month: "$created_at" }, 3] }, 1] },
              0,
              1,
            ],
          },
        ],
      };
    case "yearly":
      return { $dateToString: { format: "%Y", date: "$created_at" } };
    case "daily":
    default:
      return { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } };
  }
};

const getTotalSalesOverTime = asyncHandler(async (req, res) => {
  const { interval = "daily" } = req.query;
  const db = await connectDB();

  const ordersCollection = db.collection("shopifyOrders");

  const groupBy = getGroupByInterval(interval);

  const sales = await ordersCollection
    .aggregate([
      {
        $addFields: {
          created_at: { $toDate: "$created_at" }, // Convert `created_at` to date
          total_price: { $toDouble: "$total_price" }, // Convert `total_price` to double
        },
      },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$total_price" }, // Sum the total price
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  return res
    .status(201)
    .json(new ApiResponse(200, sales, "Sales data fetched"));
});

const getNewCustomersOverTime = asyncHandler(async (req, res) => {
  const { interval = "daily" } = req.query;
  const db = await connectDB();
  const customersCollection = db.collection("shopifyCustomers");

  const groupBy = getGroupByInterval(interval);

  const newCustomers = await customersCollection
    .aggregate([
      {
        $addFields: {
          created_at: { $toDate: "$created_at" }, // Convert `created_at` to date
        },
      },
      {
        $group: {
          _id: groupBy,
          newCustomers: { $sum: 1 }, // Count the number of new customers
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();
  return res
    .status(201)
    .json(new ApiResponse(200, newCustomers, "New Customers data fetched"));
});

const getSalesGrowthRate = asyncHandler(async (req, res) => {
  const { interval = "monthly" } = req.query;

  const db = await connectDB();

  const ordersCollection = db.collection("shopifyOrders");

  const groupBy = getGroupByInterval(interval);

  const salesData = await ordersCollection
    .aggregate([
      {
        $addFields: {
          created_at: { $toDate: "$created_at" },
          total_price: { $toDouble: "$total_price" },
        },
      },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$total_price" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $setWindowFields: {
          sortBy: { _id: 1 },
          output: {
            previousSales: {
              $shift: {
                output: "$totalSales",
                by: -1,
              },
            },
          },
        },
      },
      {
        $addFields: {
          growthRate: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$previousSales", null] },
                  { $eq: ["$previousSales", 0] },
                ],
              },
              then: 0,
              else: {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$totalSales", "$previousSales"] },
                      "$previousSales",
                    ],
                  },
                  100,
                ],
              },
            },
          },
        },
      },
    ])
    .toArray();

  return res
    .status(200)
    .json(new ApiResponse(200, salesData, "Sales Growth rate data fetched"));
});

const getRepeatedCustomers = asyncHandler(async (req, res) => {
  const { interval = "monthly" } = req.query;

  const db = await connectDB();
  const ordersCollection = db.collection("shopifyOrders");

  const groupBy = getGroupByInterval(interval);

  const repeatCustomers = await ordersCollection
    .aggregate([
      {
        $addFields: {
          created_at: { $toDate: "$created_at" },
        },
      },
      {
        $group: {
          _id: {
            customer_id: "$customer.id",
            period: groupBy,
          },
          orderCount: { $sum: 1 },
        },
      },
      {
        $match: {
          orderCount: { $gt: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.period",
          repeatCustomerCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  return res
    .status(200)
    .json(
      new ApiResponse(200, repeatCustomers, "Repeat customers data fetched")
    );
});

const getGeographicalDistribution = asyncHandler(async (req, res) => {
  const db = await connectDB();
  const customersCollection = db.collection("shopifyCustomers");

  const cityDistribution = await customersCollection
    .aggregate([
      {
        $match: {
          "default_address.city": { $ne: null },
        },
      },
      {
        $group: {
          _id: "$default_address.city",
          customerCount: { $sum: 1 },
        },
      },
      {
        $sort: { customerCount: -1 },
      },
    ])
    .toArray();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        cityDistribution,
        "geographical distribution data fetched"
      )
    );
});

const getCLTVByCohorts = asyncHandler(async (req, res) => {
  const db = await connectDB();
  const customersCollection = db.collection("shopifyCustomers");
  const ordersCollection = db.collection("shopifyOrders");

  const cohorts = await customersCollection
    .aggregate([
      {
        $lookup: {
          from: "shopifyOrders",
          localField: "id",
          foreignField: "customer.id",
          as: "orders",
        },
      },
      {
        $unwind: "$orders",
      },
      {
        $group: {
          _id: {
            cohort: {
              $dateToString: {
                format: "%Y-%m",
                date: { $toDate: "$orders.created_at" },
              },
            },
            customerId: "$_id",
          },
          totalSpent: { $sum: { $toDouble: "$orders.total_price" } },
        },
      },
      {
        $group: {
          _id: "$_id.cohort",
          cohortCLTV: { $avg: "$totalSpent" },
          totalCustomers: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
    .toArray();

  return res
    .status(200)
    .json(new ApiResponse(200, cohorts, "CLTV by cohorts fetched"));
});

export {
  getTotalSalesOverTime,
  getNewCustomersOverTime,
  getSalesGrowthRate,
  getRepeatedCustomers,
  getGeographicalDistribution,
  getCLTVByCohorts,
};
