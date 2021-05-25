export const getTags = async ({ name = '', page = 1, order = 'date', type = '' }) => {
  const url = `https://www.sakugabooru.com/tag.json?order=${order}&page=${page}&name=${name}&type=${type}`;
  const response = await fetch(url);
  return response.json();
};
