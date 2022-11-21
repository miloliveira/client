import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import ViewComments from "../components/ViewComments";
import CreateComment from "../components/CreateComment";
import PostPopup from "./PostPopup";
import FollowBtn from "./FollowBtn";
import { useDispatch, useSelector } from "react-redux";
import { isUpdatedFalse, isUpdatedTrue } from "../redux/isUpdatedGlobal";
import { AuthContext } from "../context/auth.context";
import {
  PostFromFeedList,
  PostUserInfoDiv,
  PostUserInfoLink,
  PostUserImg,
  TimeAgoDiv,
  EachPostContent,
  EachPostReactionsDiv,
  NumberOfCommentsP,
  NumberOfLikesP,
  EachPostButtonsDiv,
  LikeBtnIcon,
  DislikeBtnIcon,
  LikeButton,
  CommentBtnIcon,
  TogleCommentBtn,
} from "../styles/post.styles";
const Post = (props) => {
  const { post } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [togleComment, setTogleComment] = useState(false);
  const getToken = localStorage.getItem("authToken");
  const { isLoggedIn, user } = useContext(AuthContext);

  const isUpdatedGlobal = useSelector((state) => state.isUpdatedGlobal.value);
  console.log(isUpdatedGlobal);
  const dispatch = useDispatch();
  const numberOfLikes = post.likes.length;
  const numberOfComments = post.comments.length;

  const createdAt = new Date(post.createdAt).getTime();

  const likePost = async (postId) => {
    if (isLiked === false) {
      await axios.put(
        `http://localhost:5005/post-like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );

      await dispatch(isUpdatedFalse());
      await setIsLiked(true);
    } else if (isLiked === true) {
      await axios.put(
        `http://localhost:5005/post-dislike/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );

      await dispatch(isUpdatedFalse());
      await setIsLiked(false);
    }
  };
  useEffect(() => {
    if (isLoggedIn && post.likes.includes(user._id)) {
      setIsLiked(true);
      dispatch(isUpdatedFalse);
    }
  }, [isUpdatedGlobal]);

  return (
    <PostFromFeedList key={post._id}>
      <PostUserInfoDiv>
        <PostUserInfoLink to={`/in/${post.user._id}`}>
          <PostUserImg src={post.user.imageUrl} alt="profile pic" />
          <p>{post.user.name}</p>
        </PostUserInfoLink>
        {user && user._id !== post.user._id && (
          <FollowBtn currentUserId={user._id} followUserId={post.user._id} />
        )}
        {user && user._id == post.user._id && <PostPopup postId={post._id} />}
      </PostUserInfoDiv>
      <TimeAgoDiv>
        <ReactTimeAgo date={createdAt} locale="en-US" />
      </TimeAgoDiv>
      <EachPostContent>{post.content}</EachPostContent>
      {/* {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post pic"
          style={{ width: 200, height: 200 }}
        />
      )} */}

      <EachPostReactionsDiv>
        {numberOfLikes == 0 ? (
          <NumberOfLikesP>0 like this </NumberOfLikesP>
        ) : numberOfLikes > 1 ? (
          <NumberOfLikesP>{numberOfLikes} like this</NumberOfLikesP>
        ) : (
          <NumberOfLikesP>{numberOfLikes} likes this</NumberOfLikesP>
        )}

        {numberOfComments > 0 && numberOfComments == 1 ? (
          <NumberOfCommentsP
            onClick={() => {
              setTogleComment(!togleComment);
            }}
          >
            {numberOfComments} comment{" "}
          </NumberOfCommentsP>
        ) : (
          <NumberOfCommentsP
            onClick={() => {
              setTogleComment(!togleComment);
            }}
          >
            {numberOfComments} comments
          </NumberOfCommentsP>
        )}
      </EachPostReactionsDiv>
      <EachPostButtonsDiv>
        {isLoggedIn && (
          <LikeButton onClick={() => likePost(post._id)}>
            {isLiked ? <DislikeBtnIcon /> : <LikeBtnIcon />}
          </LikeButton>
        )}

        {isLoggedIn && (
          <TogleCommentBtn
            onClick={() => {
              setTogleComment(!togleComment);
            }}
          >
            {togleComment ? <CommentBtnIcon /> : <CommentBtnIcon />}
          </TogleCommentBtn>
        )}
      </EachPostButtonsDiv>
      {togleComment && (
        <>
          {isLoggedIn && (
            <CreateComment postId={post._id} togleComment={togleComment} />
          )}
          <ViewComments
            listComments={post.comments}
            togleComment={togleComment}
          />
        </>
      )}
    </PostFromFeedList>
  );
};

export default Post;
