import React, { useState, useRef, useEffect } from "react";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./CommentsSection.css";
import LoginCard from "./LoginCard";

const db = getFirestore();
const auth = getAuth();

const CommentsSection = ({ songId }) => {
  const [comments, setComments] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  const handleEmojiClick = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setComments((prev) => prev + emojiObject.emoji);
      textareaRef.current.focus(); // To keep the focus on the textarea after adding emoji
    } else {
      console.warn("Emoji object is undefined or does not have emoji property.");
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("songId", "==", songId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsArray = [];
      querySnapshot.forEach((doc) => {
        commentsArray.push({ id: doc.id, ...doc.data() });
      });
      setCommentList(commentsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [songId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "comments"), {
        songId,
        uid: user.uid,
        name: user.displayName || "Anonymous",
        comment: comments,
        timestamp: new Date(),
        profileImg: user.photoURL || "default-profile-img-url",
      });
      setComments("");
    } else {
      setShowLoginCard(true);
    }
  };

  const handleEditComment = async (commentId) => {
    const user = auth.currentUser;
    if (user) {
      const commentDoc = doc(db, "comments", commentId);
      await updateDoc(commentDoc, {
        comment: editCommentContent,
      });
      setEditCommentId(null);
      setEditCommentContent("");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const user = auth.currentUser;
    if (user) {
      const commentDoc = doc(db, "comments", commentId);
      await deleteDoc(commentDoc);
    }
  };

  const handleCloseLoginCard = () => {
    setShowLoginCard(false);
  };

  return (
    <div className="comments-section-container">
      {showLoginCard && <LoginCard onClose={handleCloseLoginCard} />}

      <hr className="divider-lyrics-page" />
      <h1 style={{ fontSize: "30px", paddingBottom: "20px", paddingTop: "20px" }}>
        Comments
      </h1>

      <div className="comments-list-container">
        {loading ? (
          <p className="loading-text">Loading comments...</p>
        ) : (
          commentList.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img src={comment.profileImg} className="comment-profile-img" alt="Profile" />
              <div className="comment-details">
                <p className="comment-author">{comment.name}</p>
                <p className="comment-timestamp">
                  {new Date(comment.timestamp.toDate()).toLocaleString()}
                </p>
                {editCommentId === comment.id ? (
                  <div>
                    <textarea
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      rows="4"
                      className="comment-textarea"
                    />
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="comment-edit-button"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="comment-content">{comment.comment}</p>
                )}
                {auth.currentUser?.uid === comment.uid && (
                  <div className="comment-actions">
                    {editCommentId === comment.id ? (
                      <button
                        onClick={() => setEditCommentId(null)}
                        className="comment-cancel-edit-button"
                      >
                        Cancel
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditCommentId(comment.id);
                            setEditCommentContent(comment.comment);
                          }}
                          className="comment-edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="comment-delete-button"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="comment-form-wrapper">
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            ref={textareaRef}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add a comment..."
            rows="4"
            className="comment-textarea"
          />
          <button type="submit" className="comment-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsSection;
