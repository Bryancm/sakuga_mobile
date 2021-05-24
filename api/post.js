export const getPosts = async ({ tags = '', page = 1, include_tags = 0, include_votes = 0, pageParam = 1 }) => {
  console.log('GET_POSTS', pageParam);
  const url = `https://www.sakugabooru.com/post.json?page=${pageParam}&tags=${tags}&filter=1&api_version=2&include_tags=${include_tags}&include_votes${include_votes}`;
  const response = await fetch(url);
  return response.json();
};
