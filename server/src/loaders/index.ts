import { Application } from "express";
import expressLoader from "./express.loader";

export default ({ expressApp }: { expressApp: Application }) => {
  expressLoader({ app: expressApp });
  console.log("Express loaded");
};
