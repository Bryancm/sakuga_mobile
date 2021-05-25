export const getPosts = async ({ search = '', page = 1, include_tags = 0, include_votes = 0 }) => {
  console.log('GET_POSTS', page);
  const url = `https://www.sakugabooru.com/post.json?page=${page}&tags=${search}&filter=1&api_version=2&include_tags=${include_tags}&include_votes${include_votes}`;
  const response = await fetch(url);
  return response.json();
};
