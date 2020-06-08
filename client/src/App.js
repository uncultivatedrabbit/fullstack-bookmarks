import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AddBookmark from "./AddBookmark/AddBookmark";
import BookmarkList from "./BookmarkList/BookmarkList";
import BookmarksContext from "./BookmarksContext";
import EditBookmark from "./EditBookmark/EditBookmark";
import Nav from "./Nav/Nav";
import config from "./config";
import "./App.css";

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = (bookmarks) => {
    this.setState({
      bookmarks,
      error: null,
    });
  };

  addBookmark = (bookmark) => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark],
    });
  };

  deleteBookmark = (bookmarkId) => {
    const newBookmarks = this.state.bookmarks.filter(
      (bm) => bm.id !== bookmarkId
    );
    this.setState({
      bookmarks: newBookmarks,
    });
  };

  updateBookmark = (updatedBookmark) => {
    const newBookmarks = this.state.bookmarks.map((bookmark) =>
      bookmark.id !== updatedBookmark.id ? bookmark : updatedBookmark
    );
    this.setState({
      bookmarks: newBookmarks,
    });
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        // 'Authorization': `Bearer ${config.API_KEY}`
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark,
    };
    return (
      <main className="App">
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className="content" aria-live="polite">
            <Switch>
              <Route exact path="/" component={BookmarkList} />
              <Route path="/add-bookmark" component={AddBookmark} />
              <Route path="/edit-bookmark/:id" component={EditBookmark} />
            </Switch>
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
