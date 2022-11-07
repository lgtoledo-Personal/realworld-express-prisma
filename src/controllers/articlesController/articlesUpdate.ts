import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { articleUpdatePrisma } from "../../utils/db";
import userGetPrisma from "../../utils/db/userGetPrisma";
import articleViewer from "../../view/articleViewer";

export default async function articlesUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const slug = req.params.slug;
  const { title, description, body } = req.body.article;
  const userName = req.auth?.user.username;

  // Get current user
  let currentUser;
  try {
    currentUser = await userGetPrisma(userName);
  } catch (error) {
    return next(error);
  }

  // Update the article
  let article;
  try {
    article = await articleUpdatePrisma(slug, {
      title,
      description,
      body,
    });
  } catch (error) {
    return next(error);
  }

  // Create the article view
  const articleView = articleViewer(article, currentUser || undefined);
  return res.status(200).json(articleView);
}