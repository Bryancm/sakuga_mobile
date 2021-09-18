export const getPosts = async ({
  search = '',
  page = 1,
  include_tags = 0,
  include_votes = 0,
  user = '',
  password_hash = '',
  limit = 9,
}) => {
  const url = `https://www.sakugabooru.com/post.json?page=${page}&tags=${search}&filter=1&api_version=2&include_tags=${include_tags}&include_votes=${include_votes}&login=${user}&password_hash=${password_hash}&limit=${limit}`;
  const response = await fetch(url);
  return response.json();
};

export const vote = async ({ id, score, user, password_hash }) => {
  const options = {
    method: 'POST',
  };
  const url = `https://www.sakugabooru.com/post/vote.json?id=${id}&score=${score}&login=${user}&password_hash=${password_hash}`;
  const response = await fetch(url, options);
  return response.json();
};
