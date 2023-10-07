import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as facebookStrategy } from "passport-facebook";
import dotenv from "dotenv"
dotenv.config()

passport.use(
    new GoogleStrategy({
        clientID:process.env.GOOGLECLIENT_ID,
        clientSecret:process.env.GOOGLECLIENT_SECRET,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    function (accessToken,refreshToken,profile,callback){
        callback(null,profile)
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
            callback(null,profile)
        }
    )
)

passport.serializeUser((user,done) => {
    done(null,user)
})

passport.deserializeUser((user,done)=> {
    done(null,user)
})