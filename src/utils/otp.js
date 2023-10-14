

const otp = () => {
    const min = 1000; 
    const max = 9999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
 };

 const MessageOtp = (otp) => {`<p>Please enter ${otp} to verify email and complete sign up.</p>
                    <p>This code <b>expires in 30 minutes.</b></p> 
                    <p>Press <a href="https://localhost:3000">here</a> to proceed.</p>                                                               
                    `;
         }

 export default {MessageOtp,otp}
                      
                      