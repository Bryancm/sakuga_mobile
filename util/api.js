import {tagStyles} from '../styles';

export const getTagStyle = (type) => {
  switch (type) {
    case 1:
      return tagStyles.artist_outline;
    case 3:
      return tagStyles.copyright_outline;
    case 4:
      return tagStyles.terminology_outline;
    case 5:
      return tagStyles.meta_outline;
    default:
      return tagStyles.general_outline;
  }
};

export const fetchTags = async (tags) => {
  try {
    var tagFetches = [];
    var jsonRes = [];
    var newTags = [];
    var title = '';
    for (const tag of tags) {
      tagFetches.push(
        fetch('https://www.sakugabooru.com/tag.json?name=' + tag),
      );
    }
    const responses = await Promise.all(tagFetches);
    for (const res of responses) {
      jsonRes.push(res.json());
    }
    const json_responses = await Promise.all(jsonRes);
    for (let index = 0; index < json_responses.length; index++) {
      const r = json_responses[index];
      const tg = r.find((t) => t.name === tags[index]);
      var style = getTagStyle(tg && tg.type);
      if (tg && tg.type === 1 && tg.name !== 'artist_unknown') {
        title = tg.name;
      } else if (tg.type === 3) {
        title = tg.name;
      }

      newTags.push({name: tg.name, style});
    }
    newTags.sort(function (a, b) {
      return ('' + a.type).localeCompare(b.type);
    });
    return {tags: newTags, title};
  } catch (error) {
    console.log('FETCH_TAGS_ERROR: ', error);
  }
};
