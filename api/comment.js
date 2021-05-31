export const getComments = async ({ id }) => {
  const url = `https://www.sakugabooru.com/comment.json?post_id=${id}`;
  const response = await fetch(url);
  return response.json();
};

export const addComment = async ({ id, body, user, password_hash }) => {
  const options = {
    method: 'POST',
  };
  const url = `https://www.sakugabooru.com/comment/create.json?comment[post_id]=${id}&comment[body]=${body}&login=${user}&password_hash=${password_hash}`;
  const response = await fetch(url, options);
  return response.json();
};

export const editComment = async ({ id, body, user, password_hash }) => {
  const options = {
    method: 'POST',
  };
  const url = `https://www.sakugabooru.com/comment/update.json?id=${id}&comment[body]=${body}&login=${user}&password_hash=${password_hash}`;
  const response = await fetch(url, options);
  return response.json();
};

export const deleteComment = async ({ id, user, password_hash }) => {
  const options = {
    method: 'DELETE',
  };
  const url = `https://www.sakugabooru.com/comment/destroy.json?id=${id}&login=${user}&password_hash=${password_hash}`;
  const response = await fetch(url, options);
  return response.json();
};

export const flagComment = async ({ id, user, password_hash }) => {
  const options = {
    method: 'POST',
  };
  const url = `https://www.sakugabooru.com/comment/mark_as_spam.json?id=${id}&comment[is_spam]=1&login=${user}&password_hash=${password_hash}`;
  const response = await fetch(url, options);
  return response.json();
};
