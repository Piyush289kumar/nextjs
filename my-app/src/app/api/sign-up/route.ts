import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        if (!username && !email && !password) {
            return Response.json(
                {
                    success: false,
                    message: "All Filed are Required",
                },
                {
                    status: 400,
                }
            );
        }

        const existigVerifiedUserByUsername = await UserModel.findOne({
            username: username,
            isVerify: true,
        });

        if (existigVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 400,
                }
            );
        }
        const existingUserByEmail = await UserModel.findOne({
            email: email,
        });

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerify) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    {
                        status: 400,
                    }
                );
            } else {
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now
                await existingUserByEmail.save();
            }
        } else {
            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour 
                isVerify: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        // Send Verification Email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (emailResponse.sccuess) {
            return Response.json(
                {
                    success: true,
                    message: "User registered successfully. Please verify your account.",
                },
                {
                    status: 201,
                }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 500,
                }
            );
        }
    } catch (error) {
        console.error("Error Registering User:", error);
        return Response.json(
            {
                success: false,
                message: "Error Registering User",
            },
            {
                status: 500,
            }
        );
    }
}
