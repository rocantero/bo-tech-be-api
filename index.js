const express = require("express");

const ChartsService = require("./services/charts");

const app = express();app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/api/metric/:metricId", async (req, res, next) => {
  const chartsService = new ChartsService();
  const data = await chartsService.getCharts();
  res.json( data );
 });