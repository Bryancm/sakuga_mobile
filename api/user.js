export const login = async ({ user, password_hash }) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  };
  const url = `https://www.sakugabooru.com/user/authenticate?login=${user.trim()}&password_hash=${password_hash.toLowerCase()}`;
  const response = await fetch(url, options);
  return response.json();
};
