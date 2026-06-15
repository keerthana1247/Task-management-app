const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://keerthanaD:keerthana1242007@ac-hwgkrue-shard-00-00.dv3wvry.mongodb.net:27017,ac-hwgkrue-shard-00-01.dv3wvry.mongodb.net:27017,ac-hwgkrue-shard-00-02.dv3wvry.mongodb.net:27017/?ssl=true&replicaSet=atlas-j8z2x3-shard-0&authSource=admin&appName=Cluster1")
    .then(() => console.log("MongoDB Connected 🚀"))
    .catch(err => console.log(err));

// Task Schema
const TaskSchema = new mongoose.Schema({
    text: String,
    completed: {
        type: Boolean,
        default: false
    }
});

const Task = mongoose.model("Task", TaskSchema);

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

// Home
app.get("/", (req, res) => {
    res.send("Task Manager Running 🚀");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Add task
app.post("/tasks", async (req, res) => {
    const task = new Task({
        text: req.body.task
    });

    await task.save();
    res.json(task);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Update task
app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    if (req.body.text !== undefined) {
        task.text = req.body.text;
    }

    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    await task.save();

    res.json(task);
});

// Signup
app.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10
        );

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: "Signup Successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating user"
        });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            "secretkey"
        );

        res.json({
            token,
            message: "Login Successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Login Error"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
