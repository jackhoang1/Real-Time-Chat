import passport from "passport";
import passportGoogle from "passport-google-oauth";
import UserModel from "./../../models/userModel";
import {transErrors, transSuccess} from "./../../../lang/vi";
import ChatGroupModel from "./../../models/chatGroupModel";

//run evn
require('dotenv').config();

let GoogleStrategy = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackurl = process.env.GG_CALLBACK_URL;

/**
 * Valid user account type:google
 */
let initPassportGoogle = () => {
  passport.use(new GoogleStrategy({
    clientID: ggAppId,
    clientSecret: ggAppSecret,
    callbackURL: ggCallbackurl,
    passReqToCallback : true,
    
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByGoogleUid(profile.id);
        if (user) {
            return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
        }
        console.log(profile);
      let newUserItem = {
          username: profile.displayName,
          gender: profile.gender,
          local: {isActive: true},
          google: {
            uid: profile.id,
            token:accessToken,
            email: profile.emails[0].value
          }
      };
      let newUser = await UserModel.createNew(newUserItem);
      return done(null, newUser, req.flash("success", transSuccess.loginSuccess(newUser.username)));
      
    } catch (error) {
      console.log(error);
      return done(null, false, req.flash("errors", transErrors.sever_error));
    }
  }));

  //Save userID to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  //Called by passport.session() at sever.js
  passport.deserializeUser(async(id, done) =>{
    try {
      let user = await UserModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

      user = user.toObject();
      user.chatGroupIds = getChatGroupIds;

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
};

module.exports = initPassportGoogle;