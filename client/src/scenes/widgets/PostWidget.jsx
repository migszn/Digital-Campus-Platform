import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme,InputBase,Button } from "@mui/material";
import Comment from "components/Comment";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment , setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [shouldRerender, setShouldRerender] = useState(false);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const user = useSelector((state) => state.user);
  const date = new Date(createdAt);
  const month = date.toLocaleString('default', { month: 'long' }); // Get the month name in long format
  const day = date.getDate(); // Get the day of the month
  const year = date.getFullYear(); // Get the year
  let hour = date.getHours(); // Get the hour (in 24-hour format)
  let ampm = hour >= 12 ? 'PM' : 'AM'; // Determine if it's AM or PM
  hour = hour % 12 || 12; // Convert the hour to 12-hour format
  const formattedDate = `${month} ${day} ${year} at ${hour}${ampm}`; // Create the formatted date string

  const patchLike = async () => {
    const response = await fetch(`https://ciit-plusplus-backend.onrender.com/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleComment = async() => {
    const response = await fetch(`https://ciit-plusplus-backend.onrender.com/posts/${postId}/${loggedInUserId}/comment`,{
      method:"POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: comment }), 
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setComment("");
    toast.success('Comment posted!', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  const handleDelete = async () => {
    const response = await fetch(`https://ciit-plusplus-backend.onrender.com/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const message = await response.json();
    setShouldRerender(true);
    toast.success('Post deleted!', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  if (shouldRerender) {
    return null; // return null to prevent rendering the deleted post
  }

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://ciit-plusplus-backend.onrender.com/assets/${picturePath}`}
        />
      )}
      <Typography style={{ fontSize: '0.8rem', color: '#ccc', textAlign: 'right' }}>{formattedDate}</Typography>
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        
        {(loggedInUserId === postUserId || user.isAdmin) && (
        <IconButton onClick={handleDelete}>
          <DeleteOutlined />
        </IconButton>)}
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.slice(0).reverse().map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Comment userId={comment.userId} comment={comment.comment} postId={postId}/>
            </Box>
          ))}
          <Divider />
          <FlexBetween>
          <InputBase
          placeholder="Write a comment ..."
          onChange={(e)=>setComment(e.target.value)}
          value={comment}           
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "1rem",
            padding: "1rem 2rem",
            mt:"1rem",
            height: "3rem"
          }}
        />
        <Button
          disabled={!comment}
          onClick={handleComment}
          sx={{
            color: palette.background.alt,
            mt:"1rem",
            ml:"0.5rem",
            backgroundColor: palette.primary.main,
            borderRadius: "1.25rem",
            "&:hover":{
              cursor:"pointer",
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
            },
            height: "3rem"
          }}
        >
          POST
        </Button>
          </FlexBetween>
          
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;