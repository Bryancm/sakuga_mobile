export const getPosts = async ({
  search = '',
  page = 1,
  include_tags = 0,
  include_votes = 0,
  user = '',
  password_hash = '',
  limit = '',
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

export const updatePost = async ({
  id = '',
  tags = '',
  parent_id = '',
  user = '',
  password_hash = '',
  is_shown_in_index = 1,
  old_tags = '',
}) => {
  const options = {
    method: 'POST',
  };
  const url = `https://www.sakugabooru.com/post/update.json?id=${id}&post[tags]=${tags}&post[old_tags]=${old_tags}&post[parent_id]=${parent_id}&post[is_shown_in_index]=${is_shown_in_index}&login=${user}&password_hash=${password_hash}`;
  const response = await fetch(url, options);
  return response.json();
};
