import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as facebookStrategy } from "passport-facebook";
import dotenv from "dotenv"
import pool from "../database/db";
dotenv.config()

const getProfile = (profile) => {
    const {id,emails,displayName,provider} = profile
    if(emails?.length){
        const email = emails[0].value
        return {
            google_id: id,
            user_name:displayName,
            email,
            provider
        }
    }
    return null
}
passport.use(
    new GoogleStrategy({
        clientID:process.env.GOOGLECLIENT_ID,
        clientSecret:process.env.GOOGLECLIENT_SECRET,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async (accessToken,refreshToken,profile,callback) => {
        //callback(null,profile)
        try{
            const existingGoogleAccount = await pool.query("SELECT * FROM users WHERE google_id = $1",[profile.id])
            if(!existingGoogleAccount){
                const existingEmailAccount = await pool.query("SELECT * FROM users WHERE email = $1",[getProfile(profile).email])
                if(!existingEmailAccount){
                    const newAccount = await pool.query("INSERT INTO users WHERE user_name =$1,user_email=$2,google_id =$3 RETURNING *",[getProfile(profile).user_name,getProfile(profile).email,getProfile(profile).google_id])
                    return callback(null, newAccount)//if the user does not exist 
                }
            }
            return callback(null,existingGoogleAccount)//if the user exists
        }catch(err){
            throw new Error(err)
        }
    }
    )
)

passport.use(
    new facebookStrategy(
        {
            clientID:process.env.FACEBOOKCLIENT_ID,
            clientSecret:process.env.FACEBOOKCLIENT_SECRET,
            callbackURL:"/auth/facebook/callback",
            profileFields:['emails','displayName','name','picture']
        },
        async (accessToken,refreshToken,profile,callback) => {
            //callback(null,profile)
            try{
                const existingGoogleAccount = await pool.query("SELECT * FROM users WHERE google_id = $1",[profile.id])
                if(!existingGoogleAccount){
                    const existingEmailAccount = await pool.query("SELECT * FROM users WHERE email = $1",[getProfile(profile).email])
                    if(!existingEmailAccount){
                        const newAccount = await pool.query("INSERT INTO users WHERE user_name =$1,user_email=$2,google_id =$3 RETURNING *",[getProfile(profile).user_name,getProfile(profile).email,getProfile(profile).google_id])
                        return callback(null, newAccount)//if the user does not exist
                    }
                }
                return callback(null,existingGoogleAccount)//if the user exists
            }catch(err){
                throw new Error(err)
            }
        }
    )
)

passport.serializeUser((user,done) => {//saves data to session
    done(null,user.id)
})

passport.deserializeUser((user,done)=> {
    done(null,user)
})