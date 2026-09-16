import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginAdmin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		const admin = await User.findOne({
			email: email.trim().toLowerCase(),
			role: "admin",
		}).select("+password");

		if (!admin || !(await admin.matchPassword(password))) {
			return res.status(401).json({
				success: false,
				message: "Invalid admin email or password",
			});
		}

		const token = jwt.sign(
			{
				id: admin.id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		return res.status(200).json({
			success: true,
			message: "Admin logged in successfully",
			token,
			admin: {
				id: admin.id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
			},
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

export const loginVendor = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		const vendor = await User.findOne({
			email: email.trim().toLowerCase(),
			role: "vendor",
		}).select("+password");

		if (!vendor || !(await vendor.matchPassword(password))) {
			return res.status(401).json({
				success: false,
				message: "Invalid vendor email or password",
			});
		}

		const token = jwt.sign(
			{
				id: vendor.id,
				name: vendor.name,
				email: vendor.email,
				role: vendor.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		return res.status(200).json({
			success: true,
			message: "Vendor logged in successfully",
			token,
			vendor: {
				id: vendor.id,
				name: vendor.name,
				email: vendor.email,
				role: vendor.role,
			},
		});
	} catch (err) {
		return res.status(500).json({ success: false, message: err.message });
	}
};

export const registerVendor = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ success: false, message: "Name, email, and password are required" });
		}

		const normalizedEmail = email.trim().toLowerCase();
		const existingUser = await User.findOne({ email: normalizedEmail });
		if (existingUser) {
			return res.status(409).json({ success: false, message: "An account with this email already exists" });
		}

		const vendor = await User.create({
			name: name.trim(),
			email: normalizedEmail,
			password,
			role: "vendor",
		});

		return res.status(201).json({
			success: true,
			message: "Vendor account created successfully",
			vendor: { id: vendor.id, name: vendor.name, email: vendor.email, role: vendor.role },
		});
	} catch (err) {
		return res.status(500).json({ success: false, message: err.message });
	}
};