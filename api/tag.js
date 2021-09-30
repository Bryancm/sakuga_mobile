export const getTags = async ({ name = '', page = 1, order = 'date', type = '', limit = '' }) => {
  const url = `https://www.sakugabooru.com/tag.json?order=${order}&page=${page}&type=${type}&name=${name}&limit=${limit}`;
  const response = await fetch(url);
  return response.json();
};

export const findTag = async ({ name = '' }) => {
  const url = `https://www.sakugabooru.com/tag.json?name=${name}`;
  const response = await fetch(url);
  return response.json();
};

export const getRelatedTags = async ({ tags = '', type = '' }) => {
  const url = `https://www.sakugabooru.com/tag/related.json?tags=${tags}&type=${type}`;
  const response = await fetch(url);
  return response.json();
};
