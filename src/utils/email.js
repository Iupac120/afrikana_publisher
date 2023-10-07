import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

export const MessageOtp = `<p>Please enter ${otp} to verify email and complete sign up.</p>
                    <p>This code <b>expires in 30 minutes.</></p> 
                    <p>Press <a href="https://localhost:3000>here</a> to proceed.</p>                                                               
                    `
export async function sendMail (email,message){
    const transporter = await nodemailer.createTransport({
        service:process.env.NODEMAILER_SERVICE,
        auth:{
            user:process.env.NODEMAILER_USER,
            pass:process.env.NODEMAILER_PASS
        }
    })
    

    const info = await transporter.sendMail({
        from:`"Austech"<${process.env.NODEMAILER_USER}>`,
        to:email,
        subject:"OTP VERIFICATION",
        html:message
    })
}
