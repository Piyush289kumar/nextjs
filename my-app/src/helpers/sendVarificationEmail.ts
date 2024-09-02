import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(email: string, username: string, verificationCode: string): Promise<ApiResponse> {

    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'My App | Verification Code',
            react: VerificationEmail({ username: username, otp: verificationCode }),
        });

        return { sccuess: true, message: "Verfication Code Email is send Successfully" }
    } catch (emailError) {
        console.log("Error Sending Verfication Email", emailError);
        return { sccuess: false, message: "Failed to send Verfication Code Email" }

    }
}