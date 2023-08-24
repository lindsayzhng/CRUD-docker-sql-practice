// Import essential libraries
const express = require("express");
const pool = require("./config/db");
const app = express();
app.use(express.json());

const PORT = 3000;

// Setup DB by adding users table
app.get("/setup", async (req, res) => {
  console.log("Starting the setup");
  try {
    await pool.query(
      "CREATE TABLE users( id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100) )"
    );
    res.status(200).send({ message: "Successfully created table" });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500);
  }
});

// Get all users from DB
app.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500);
  }
});

// GET user by Id
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      const user = result.rows[0];
      return res.json(user);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});


//create new user and add to DB
app.post("/", async (req, res) => {
  const { name, address } = req.body;
  try {
    const data = await pool.query("INSERT INTO users( name, address ) VALUES ($1, $2) ", [name, address]);
    res.status(200).send("Successfully added new user");
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500);
  }
});

// The PUT endpoint for the Update functionality
app.put('/:id', async (req, res) => {
    const id = req.params.id;
    const keys = ["name", "address"];
    const fields = [];
    
    keys.forEach((key) => {
        if (req.body[key]) fields.push(key);
    });

    try{
        // First we check if the record ID being requested to update exists in the db
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if(result.rows.length === 0){   // If not exists, return error
            res.status(404).send('User not found');
        }
        else{   // If exists, query an update to the record for each field
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                await pool.query(`UPDATE users SET ${field} = $1 WHERE id = $2;`, [req.body[field], id])                
            }
            res.status(200).send("Successfully updated user");  // Return success code and message
        }
    }
    catch (err){    // Catch any errors
        console.log(err)
        res.sendStatus(500)
    }    
})

// use port 3000 unless there exists a pre-configured port
app.listen(process.env.port || PORT, () => {
  console.log(`Server is running on PORT ${process.env.port || PORT}.`);
});
