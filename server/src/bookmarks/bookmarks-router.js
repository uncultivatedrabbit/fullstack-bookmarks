const express = require("express");
const bodyParser = express.json();
const bookmarksRouter = express.Router();
const logger = require("../logger");
const BookmarkServices = require("../bookmark-services");
const xss = require("xss");

bookmarksRouter
  .route("/api/bookmark")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    BookmarkServices.getAllBookmarks(knexInstance)
      .then((bookmark) => {
        res.json(
          bookmark.map((b) => ({
            id: b.id,
            title: xss(b.title),
            description: xss(b.description),
            url: xss(b.url),
            rating: +b.rating,
            date_published: b.date_published,
          }))
        );
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, description, url, rating } = req.body;

    const newBookmark = { title, description, url, rating };
    // check that all values exist
    for (const [key, value] of Object.entries(newBookmark)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    }
    // check to make sure rating is an int between 1-5
    if (+rating !== +rating || rating > 5 || rating < 1) {
      return res.status(400).json({
        error: { message: "rating must be a number between 1 and 5" },
      });
    }
    BookmarkServices.insertBookmark(req.app.get("db"), newBookmark)
      .then((bookmark) => {
        logger.info(`Bookmark created!`);
        res
          .status(201)
          .location(`/api/bookmark/${bookmark.id}`)
          .json({
            id: bookmark.id,
            title: xss(bookmark.title),
            description: xss(bookmark.description),
            url: xss(bookmark.url),
            rating: +bookmark.rating,
            date_published: bookmark.date_published,
          });
      })
      .catch(next);
  });

bookmarksRouter
  .route("/api/bookmark/:id")
  .all((req, res, next) => {
    BookmarkServices.getById(req.app.get("db"), req.params.id)
      .then((bookmark) => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: "Bookmark doesn't exist." },
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      id: res.bookmark.id,
      title: xss(res.bookmark.title),
      description: xss(res.bookmark.description),
      url: xss(res.bookmark.url),
      rating: +res.bookmark.rating,
      date_published: res.bookmark.date_published,
    });
  })
  .delete((req, res) => {
    BookmarkServices.deleteBookmark(req.app.get("db"), req.params.id).then(
      () => {
        logger.info(`Bookmark deleted!`);
        res.status(204).end();
      }
    );
  })
  .patch(bodyParser, (req, res, next) => {
    const { title, description, url, rating } = req.body;
    const bookmarkToUpdate = { title, description, url, rating };
    const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'description' or 'rating'`,
        },
      });
    }
    BookmarkServices.updateBookmark(
      req.app.get("db"),
      req.params.id,
      bookmarkToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarksRouter;
