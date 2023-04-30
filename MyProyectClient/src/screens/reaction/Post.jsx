import React, { useState } from 'react';
import { addReaction, getReactionCounts } from '../reaction/ReactionApi';

const Reaction = ({ post }) => {
  const [reactionCounts, setReactionCounts] = useState({});

  const handleAddReaction = async (type) => {
    try {
      await addReaction(post.id, type);
      const newReactionCounts = await getReactionCounts(post.id);
      setReactionCounts(newReactionCounts);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => handleAddReaction('LIKE')}>Like</button>
      <button onClick={() => handleAddReaction('DISLIKE')}>Dislike</button>
      <p>
        Likes: {reactionCounts.LIKE || 0} Dislikes: {reactionCounts.DISLIKE || 0}
      </p>
    </div>
  );
};

export default Reaction;