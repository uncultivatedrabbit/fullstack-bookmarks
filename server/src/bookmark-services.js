const BookmarkServices = {
  getAllBookmarks(knex) {
    return knex.select("*").from("bookmarks");
  },
  insertBookmark(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into("bookmarks")
      .returning("*")
      .then((rows) => rows[0]);
  },
  getById(knex, id) {
    return knex.from("bookmarks").select("*").where("id", id).first();
  },
  deleteBookmark(knex, id) {
    return knex.from("bookmarks").where({ id }).delete();
  },
  updateBookmark(knex, id, newBookmarkField) {
    return knex.from("bookmarks").where({ id }).update(newBookmarkField);
  },
};

module.exports = BookmarkServices;
