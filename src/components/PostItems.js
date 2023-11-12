import { Box } from 'grommet';
import React, { useMemo } from 'react';
import PostItem from './PostItem';

function splitTime(newerTime, olderTime) {
  const totalSeconds = Math.floor(
    (new Date(newerTime).getTime() - new Date(olderTime).getTime()) / 1000
  );
  const daysRemainder = totalSeconds % (60 * 60 * 24);
  const days = (totalSeconds - daysRemainder) / 60 / 60 / 24;
  const hoursRemainder = daysRemainder % (60 * 60);
  const hours = (daysRemainder - hoursRemainder) / 60 / 60;
  const minutesReminder = hoursRemainder % 60;
  const minutes = (hoursRemainder - minutesReminder) / 60;
  const seconds = minutesReminder;

  return { days, hours, minutes, seconds, totalSeconds };
}

function getGapText(gap) {
  if (gap.days > 0) {
    return `${gap.days} ${gap.days > 1 ? 'days' : 'day'}`;
  }

  if (gap.hours > 0) {
    return `${gap.hours} ${gap.hours > 1 ? 'hours' : 'hour'}`;
  }

  if (gap.minutes > 0) {
    return `${gap.minutes} ${gap.minutes > 1 ? 'minutes' : 'minute'}`;
  }

  return `${gap.seconds} ${gap.seconds > 1 ? 'seconds' : 'second'}`;
}

function getAgoText(ago) {
  if (ago.days > 1) {
    return `${ago.days} days ago`;
  }

  if (ago.days === 1) {
    return 'Yesterday';
  }

  if (ago.hours > 0) {
    return `${ago.hours} ${ago.hours > 1 ? 'hours' : 'hour'} ago`;
  }

  if (ago.minutes > 0) {
    return `${ago.minutes} ${ago.minutes > 1 ? 'minutes' : 'minute'} ago`;
  }

  return `just now`;
}

function PostItems({ posts }) {
  const timeDiffs = useMemo(() => {
    const obj = {};
    (posts || []).forEach((post, index) => {
      obj[post.sortKey] = {};

      if (posts[index + 1]) {
        const gap = splitTime(post.createdAt, posts[index + 1].createdAt);
        obj[post.sortKey].gap = getGapText(gap);
      }

      const ago = splitTime(new Date(), post.createdAt);
      obj[post.sortKey].ago = getAgoText(ago);
    });

    return obj;
  }, [posts]);

  if (!posts?.length) {
    return null;
  }

  return posts.map(post => (
    <Box key={post.sortKey} margin="0 0 1rem">
      <PostItem item={post} timeDiff={timeDiffs[post.sortKey]} />
    </Box>
  ));
}

export default PostItems;
