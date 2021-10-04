// Karan Thakkar[14-07-21] API to find insights from data

// required imports
const express = require("express");
const db = require("../../db-init/dbConn");
const router = express.Router();

// 1. Find highest total_traded_quantity
router.get("/highestTotalTradedQuantity", async (req, res) => {
  const highestTradedQuantity = await db.any(
    ` select * from stock_prices where total_traded_quantity=(select MAX(total_traded_quantity) from stock_prices); `
  );
  res.status(200).json({
    message: "For this stock this was maximum quantity traded",
    StockName: highestTradedQuantity[0].symbol,
    Date: highestTradedQuantity[0].date,
    Highest_Total_Traded_Quantity:
      highestTradedQuantity[0].total_traded_quantity,
  });
});

// 2. Find Top 5 Gainers
router.get("/top5Gainers", async (req, res) => {
  let gainersResult = [];
  const top5Gainers = await db.any(
    `select *, close_price-open_price AS top_gainer from stock_prices ORDER BY top_gainer DESC LIMIT 5;`
  );

  for (let value of top5Gainers.values()) {
    gainersResult.push([value.symbol, value.date, value.top_gainer]);
  }

  res.status(200).json({
    message: "This are the Top 5 gainers of the month",
    StockDetails: gainersResult,
  });
});

// 3. Top 5 Losers
router.get("/top5Losers", async (req, res) => {
  let losersResult = [];

  const top5Losers = await db.any(
    `select *, close_price-open_price AS top_gainer from stock_prices ORDER BY top_gainer ASC LIMIT 5;`
  );

  for (let value of top5Losers.values()) {
    losersResult.push([value.symbol, value.date, value.top_gainer]);
  }

  res.status(200).json({
    message: "This are the Top 5 losers of the month",
    StockDetails: losersResult,
  });
});

module.exports = router;
