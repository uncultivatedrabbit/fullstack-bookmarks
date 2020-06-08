import React, { Component } from "react";
import BookmarksContext from "../BookmarksContext";
import config from "../config";
import "./EditBookmark.css";

export default class EditBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    id: "",
    title: "",
    description: "",
    url: "",
    rating: "",
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.id;
    const headers = {
      method: "GET",
      headers: { "content-type": "application/json" },
    };
    fetch(`${config.API_ENDPOINT}/${bookmarkId}`, headers)
      .then((res) => {
        if (!res.ok) {
          res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          id: data.id,
          title: data.title,
          description: data.description,
          url: data.url,
          rating: data.rating,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { title, url, description, rating, id } = this.state;
    const newBookmark = { title, url, description, rating, id };
    const newBookmarkId = this.props.match.params.id;
    const headers = {
      method: "PATCH",
      body: JSON.stringify(newBookmark),
      headers: { "content-type": "application/json" },
    };
    fetch(`${config.API_ENDPOINT}/${newBookmarkId}`, headers)
      .then((res) => {
        if (!res.ok) {
          res.json().then((error) => Promise.reject(error));
        }
      })
      .then(() => {
        this.context.updateBookmark(newBookmark);
        this.props.history.push("/");
      });
  };

  renderForm = () => {
    const { title, url, description, rating } = this.state;
    return (
      <form id="edit-form" onSubmit={this.handleSubmit}>
        <legend>Edit Bookmark</legend>
        <label>Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={this.handleChange}
        />
        <label>URL:</label>
        <input type="text" id="url" value={url} onChange={this.handleChange} />
        <label>Description:</label>
        <textarea
          rows="5"
          cols="55"
          id="description"
          value={description}
          onChange={this.handleChange}
        />
        <p>Rating:</p>
        <input
          type="number"
          min="1"
          max="5"
          id="rating"
          value={rating}
          onChange={this.handleChange}
        />
        <button className="btn" type="submit">
          Make changes!
        </button>
      </form>
    );
  };

  render() {
    return <div>{this.renderForm()}</div>;
  }
}
