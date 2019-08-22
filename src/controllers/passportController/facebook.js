import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "./../../models/userModel";
import {transErrors, transSuccess} from "./../../../lang/vi";
import ChatGroupModel from "./../../models/chatGroupModel";

//run evn
require('dotenv').config();

let FacebookStrategy = passportFacebook.Strategy;

let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbCallbackurl = process.env.FB_CALLBACK_URL;

/**
 * Valid user account type: facebook
 */
let initPassportFacebook = () => {
  passport.use(new FacebookStrategy({
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbCallbackurl,
    passReqToCallback : true,
    profileFields: ["email", "gender", "displayName"]
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByFacebookUid(profile.id);
        if (user) {
            return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
        }
      let newUserItem = {
          username: profile.displayName,
          gender: profile.gender,
          local: {isActive: true},
          facebook: {
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

module.exports = initPassportFacebook;