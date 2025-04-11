import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await dbConnect();
        
        // Validate request body
        const body = await req.json();
        if (!body.email || !body.password) {
            return NextResponse.json({ 
                error: "Email and password are required" 
            }, { status: 400 });
        }

        const { email, password } = body;
        console.log('Login attempt for email:', email);

        // Find user with case-insensitive email match
        const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (!user) {
            console.log('No user found with email:', email);
            return NextResponse.json({ 
                error: "Invalid credentials" 
            }, { status: 401 });
        }

        // Debug password comparison
        console.log('Stored password hash:', user.password);
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password validation result:', validPassword);

        if (!validPassword) {
            console.log('Invalid password for user:', email);
            return NextResponse.json({ 
                error: "Invalid credentials" 
            }, { status: 401 });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        const response = NextResponse.json({ 
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token 
        }, { status: 200 });

        response.cookies.set("authToken", token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600 
        });

        return response;
    } catch (error) {
        console.error('Sign-in error:', error);
        return NextResponse.json({ 
            error: "Authentication failed",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}