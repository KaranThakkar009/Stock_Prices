// Karan Thakkar[13-07-21] API for stock price

// required imports
const express = require("express");
const db = require("../../db-init/dbConn");
const router = express.Router();
const { authToken } = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/admin");
// GET API
// return success code 200 and a message "Stocks Fetched Successfully" if atleast one stock exists in database
// returns error code 400 and a message "No records found!" if stocks doesn't exists in database
router.get("/", async (req, res, next) => {
  try {
    const stocksList = await db.any(`select * from stock_prices`);
    if (stocksList.length > 0) {
      res.status(200).json({
        data: stocksList,
        message: "Stocks Fetched Successfully",
      });
    } else {
      res.status(400).json({
        message: "No records found!",
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST API
// return success code 200 and a message "Stock added successfully" if stockName,date,prevClose,openPrice,highPrice,lowPrice,lastPrice,closePrice,averagePrice,totalTradedQuantity are provided in the request
// return an error code of 400 and a message "All fields required!" if stockName,date,prevClose,openPrice,highPrice,lowPrice,lastPrice,closePrice,averagePrice,totalTradedQuantity any one of them is not provided in the request
router.post("/addNewStock", async (req, res) => {
  try {
    const {
      stockName,
      date,
      prevClose,
      openPrice,
      highPrice,
      lowPrice,
      lastPrice,
      closePrice,
      averagePrice,
      totalTradedQuantity,
    } = await req.body;

    const alreadyExists = await db.any(
      `select * from stock_prices where date='${date}' AND symbol='${stockName}'`
    );

    if (alreadyExists.length >= 1) {
      return res.status(400).json({
        message: "Record already exists cannot add!",
      });
    }
    if (Object.keys(req.body).length < 10) {
      return res.status(400).json({
        message: "All fields required!",
      });
    }

    const addStock = await db.one(`insert into stock_prices(symbol,
      date,
      prev_close,
      open_price,
      high_price,
      low_price,
      last_price,
      close_price,
      average_price,
      total_traded_quantity) values('${stockName}','${date}',${prevClose},${openPrice},${highPrice},${lowPrice},${lastPrice},${closePrice},${averagePrice},${totalTradedQuantity}) returning stock_id`);

    console.log("addStock: ", addStock);
    return res.status(200).json({
      data: addStock,
      message: "Stock added successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "All fields required!",
    });
  }
});

// PUT API
// return an success code of 200 and a message "All fields required" if stockName,date,openPrice is provided in the request
// return an error code of 400 and a message "Stock cannot be updated!" if stockName,date,openPrice is not provided in the request
router.put("/updateStockPrice", async (req, res, next) => {
  try {
    const { stockName, date, openPrice } = await req.body;
    if (Object.keys(req.body).length < 3) {
      res.status(400).json({
        message: "All fields required!",
      });
    }
    const updatedStock = await db.any(
      `UPDATE stock_prices SET open_price=${openPrice} WHERE symbol='${stockName}' AND date='${date}' returning symbol AS stock_name,date AS Date,open_price AS updated_stock_price`
    );
    if (updatedStock.length > 0) {
      res.status(200).json({
        data: updatedStock,
        message: "Stock updated successfully",
      });
    } else {
      res.status(200).json({
        message: "Failed to update!",
      });
    }
  } catch (error) {
    next(error);
  }
});

//DELETE API
// return an error code of 400 and a message "Stock can not be deleted!" if stockName or date is not provided in the request
// return an success code of 200 and a message "Stock deleted successfully" if stockName and date is provided in the request
router.delete("/deleteStock", async (req, res, next) => {
  try {
    if (Object.keys(req.body).length < 2) {
      res.status(400).json({
        message: "StockName and Date required!",
      });
    }
    const { stockName, date } = req.body;
    const deletedStock = await db.result(
      `delete from stock_prices where symbol='${stockName}' and date='${date}'`
    );

    if (deletedStock["rowCount"] > 0) {
      res.status(200).json({
        message: "Stock deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "Stock can not be deleted!",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
