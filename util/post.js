import { tagStyles } from '../styles';

export const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

export const postWithDetails = (tagsWithType, post, votes = []) => {
  var artist = '';
  var copyright = '';
  var tags = [];
  const postTags = post.tags.split(' ');
  for (const tag of postTags) {
    const type = tagsWithType[tag];
    var style = tagStyles.artist_outline;
    if (type === 'artist') artist = artist + ' ' + capitalize(tag);
    if (type === 'copyright') {
      style = tagStyles.copyright_outline;
      copyright = tag;
    }
    if (type === 'terminology') style = tagStyles.terminology_outline;
    if (type === 'meta') style = tagStyles.meta_outline;
    if (type === 'general') style = tagStyles.general_outline;
    tags.push({ type, tag, style });
  }

  const name =
    artist.trim() && artist.trim() !== 'Artist_unknown'
      ? artist.replace('Artist_unknown', '').trim()
      : copyright.trim();
  const title = name ? capitalize(name).replace(/_/g, ' ') : name;

  tags.sort((a, b) => a.type && a.type.localeCompare(b.type));
  post.userScore = votes[post.id] ? votes[post.id] : 0;
  post.tags = tags;
  post.title = title;
  return post;
};
