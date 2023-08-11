import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { appEnvVars } from "@/utils/env-vars";
import passport from "passport";
import UserRepository from "@/db/repository/user";

const userRepo = new UserRepository();

let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: appEnvVars.jwtSecret,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = userRepo.findUser({ id: payload.id });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtStrategy);

export = passport.authenticate("jwt", {
  session: false,
});
