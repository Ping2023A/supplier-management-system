const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/api/suppliers", (req, res) => {
  res.json([
    {
      name: "ABC Electronics",
      contact: "John Carter",
      location: "New York, USA",
      performance: "92%",
      status: "Active",
    },
    {
      name: "Global Textiles",
      contact: "Sarah Lee",
      location: "Los Angeles, USA",
      performance: "87%",
      status: "Active",
    },
  ]);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});