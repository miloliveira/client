import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import {
  PostPopupDiv,
  PostPopupIcon,
  AboveContentPostPopup,
  AboveContentPostPopupLink,
} from "../styles/post.styles";
import { useDispatch, useSelector } from "react-redux";
import { isUpdatedFalse, isUpdatedTrue } from "../redux/isUpdatedGlobal";

const PostPopup = (props) => {
  const isUpdatedGlobal = useSelector((state) => state.isUpdatedGlobal.value);
  console.log(isUpdatedGlobal);
  const dispatch = useDispatch();
  const { postId, editing, setEditing, showPostPopup, setShowPostPopup } =
    props;

  const [content, setContent] = useState("");
  const getToken = localStorage.getItem("authToken");

  const deletePost = async (postId) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/post-delete/${postId}`,

      {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      }
    );

    dispatch(isUpdatedFalse());
  };
  const getPost = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/post/${postId}`
    );
    await setContent(response.data.content);
    console.log("this is this posts content", content);
    // dispatch(isUpdatedFalse());
  };

  const editPost = async (e) => {
    e.preventDefault();
    const body = await { content };
    await axios.put(
      `${process.env.REACT_APP_API_URL}/post-update/${postId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      }
    );
    console.log("the post was updated");
    dispatch(isUpdatedFalse());
  };

  return (
    <PostPopupDiv>
      <button onClick={() => setShowPostPopup(!showPostPopup)}>
        <PostPopupIcon />
      </button>
      {showPostPopup && (
        <AboveContentPostPopup>
          <button
            onClick={() => {
              setEditing(!editing);
              setShowPostPopup(false);
            }}
          >
            edit
          </button>

          <button onClick={() => deletePost(postId)}>delete</button>
        </AboveContentPostPopup>
      )}
    </PostPopupDiv>
  );
};

export default PostPopup;
