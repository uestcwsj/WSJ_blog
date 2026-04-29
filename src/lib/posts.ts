type PostLike = {
  slug: string;
  data: {
    title: string;
    pubDate: Date;
    draft?: boolean;
  };
};

export function sortPostsByDateDesc<TPost extends PostLike>(posts: TPost[]): TPost[] {
  posts.forEach((post) => {
    if (!post.slug) {
      throw new Error('Post slug is required');
    }
  });

  return [...posts].sort((a, b) => {
    const dateDiff = b.data.pubDate.getTime() - a.data.pubDate.getTime();
    return dateDiff === 0 ? a.slug.localeCompare(b.slug) : dateDiff;
  });
}

export function getPublishedPosts<TPost extends PostLike>(posts: TPost[]): TPost[] {
  return sortPostsByDateDesc(posts.filter((post) => !post.data.draft));
}
