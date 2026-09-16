const express = require("express")
const { Pool } = require("pg")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

/*
  TEST ROUTE
*/
app.get("/", (req, res) => {
  res.send("IT Support Backend is running")
})

/*
  DATABASE HEALTH CHECK
*/
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT NOW()")

    res.json({
      status: "OK",
      database: "Connected",
      message: "IT Support Ticket System API is running",
    })
  } catch (error) {
    console.error("Database connection error:", error.message)

    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
    })
  }
})

/*
  GET ALL TICKETS
*/
app.get("/api/tickets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tickets ORDER BY id ASC"
    )

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching tickets:", error.message)

    res.status(500).json({
      error: "Failed to fetch tickets",
    })
  }
})

/*
  GET ONE TICKET
*/
app.get("/api/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      "SELECT * FROM tickets WHERE id = $1",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Ticket not found",
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching ticket:", error.message)

    res.status(500).json({
      error: "Failed to fetch ticket",
    })
  }
})

/*
  CREATE TICKET
*/
app.post("/api/tickets", async (req, res) => {
  try {
    const {
      user,
      title,
      category,
      priority,
      status,
      description,
      troubleshooting,
    } = req.body

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
      })
    }

    const defaultTroubleshooting = [
      {
        text: "Review reported issue",
        completed: false,
      },
      {
        text: "Check system configuration",
        completed: false,
      },
      {
        text: "Perform troubleshooting tests",
        completed: false,
      },
      {
        text: "Verify resolution",
        completed: false,
      },
    ]

    const troubleshootingSteps =
      Array.isArray(troubleshooting) && troubleshooting.length > 0
        ? troubleshooting
        : defaultTroubleshooting

    const result = await pool.query(
      `INSERT INTO tickets
        (
          user_name,
          title,
          category,
          priority,
          status,
          description,
          troubleshooting
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        user || "",
        title,
        category || "Network",
        priority || "Medium",
        status || "Open",
        description || "",
        JSON.stringify(troubleshootingSteps),
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("Error creating ticket:", error.message)

    res.status(500).json({
      error: "Failed to create ticket",
    })
  }
})

/*
  UPDATE TICKET
  Used mainly for changing status
*/
app.put("/api/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params
    const {
      user,
      title,
      category,
      priority,
      status,
      description,
    } = req.body

    const result = await pool.query(
      `UPDATE tickets
       SET
         user_name = COALESCE($1, user_name),
         title = COALESCE($2, title),
         category = COALESCE($3, category),
         priority = COALESCE($4, priority),
         status = COALESCE($5, status),
         description = COALESCE($6, description)
       WHERE id = $7
       RETURNING *`,
      [
        user,
        title,
        category,
        priority,
        status,
        description,
        id,
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Ticket not found",
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Error updating ticket:", error.message)

    res.status(500).json({
      error: "Failed to update ticket",
    })
  }
})

app.put("/api/tickets/:id/troubleshooting", async (req, res) => {
  try {
    const { id } = req.params
    const { troubleshooting } = req.body

    if (!Array.isArray(troubleshooting)) {
      return res.status(400).json({
        error: "Troubleshooting must be an array",
      })
    }

    const result = await pool.query(
      `UPDATE tickets
       SET troubleshooting = $1
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(troubleshooting), id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Ticket not found",
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(
      "Error updating troubleshooting:",
      error.message
    )

    res.status(500).json({
      error: "Failed to update troubleshooting",
    })
  }
})

/*
  DELETE TICKET
*/
app.delete("/api/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      "DELETE FROM tickets WHERE id = $1 RETURNING *",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Ticket not found",
      })
    }

    res.json({
      message: "Ticket deleted successfully",
      ticket: result.rows[0],
    })
  } catch (error) {
    console.error("Error deleting ticket:", error.message)

    res.status(500).json({
      error: "Failed to delete ticket",
    })
  }
})

const PORT = 5000

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`)
})