import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Icon, Layout, Text, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { storeData, getData } from '../util/storage';
import { vote } from '../api/post';
import Toast from 'react-native-simple-toast';

const MoreIcon = (props) => <Icon {...props} name="more-vertical-outline" />;
const StarIcon = (props) => <Icon {...props} name="star-outline" />;
const StarIconGood = (props) => <Icon {...props} name="star-outline" fill="#207561" />;
const StarIconGreat = (props) => <Icon {...props} name="star-outline" fill="#649d66" />;
const StarIconFav = (props) => <Icon {...props} name="star-outline" fill="#eebb4d" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const DownloadIcon = (props) => <Icon {...props} name="download-outline" />;
const LinkIcon = (props) => <Icon {...props} name="link-2-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;
const TrashIcon = (props) => <Icon {...props} name="trash-outline" fill="#E3170A" />;

export const PostMenu = ({
  item,
  deleteAlert,
  level = '1',
  sizeStar = 'small',
  sizeMore = 'small',
  menuStyle,
  menuStyle2,
}) => {
  const [itemScore, setItemScore] = React.useState(item.score);
  const [userScore, setUserScore] = React.useState(item.userScore ? item.userScore : 0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuVisible2, setMenuVisible2] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const toggleMenu2 = () => {
    setMenuVisible2(!menuVisible2);
  };
  const menuAnchor = () => {
    var accessoryLeft = StarIcon;
    var color = '#E3170A';
    if (userScore === 1) {
      accessoryLeft = StarIconGood;
      color = '#207561';
    }
    if (userScore === 2) {
      accessoryLeft = StarIconGreat;
      color = '#649d66';
    }
    if (userScore === 3) {
      accessoryLeft = StarIconFav;
      color = '#eebb4d';
    }
    return (
      <Button
        size={sizeStar}
        style={menuStyle ? menuStyle : { paddingHorizontal: 0 }}
        appearance="ghost"
        accessoryLeft={accessoryLeft}
        onPress={toggleMenu}>
        <Text style={{ color }} category="c1">
          {itemScore}
        </Text>
      </Button>
    );
  };

  const menuAnchor2 = () => (
    <Button
      size={sizeMore}
      style={menuStyle2 ? menuStyle2 : { paddingHorizontal: 0 }}
      status="basic"
      appearance="ghost"
      accessoryRight={MoreIcon}
      onPress={toggleMenu2}
    />
  );

  const remove = () => {
    toggleMenu2();
    deleteAlert(item);
  };

  const addToWatchList = async () => {
    try {
      toggleMenu2();
      var newWatchList = [item];
      const currentWatchList = await getData('watchList');
      if (currentWatchList) {
        const filteredWatchList = currentWatchList.filter((p) => p.id !== item.id);
        newWatchList = [item, ...filteredWatchList];
      }
      await storeData('watchList', newWatchList);
      Toast.show('Added to watch later');
    } catch (error) {
      console.log('ADD_WATCH_LATER_ERROR: ', error);
      Toast.show('Error');
    }
  };

  const addScore = async (score) => {
    try {
      toggleMenu();
      setLoading(item.id);
      const user = await getData('user');
      if (!user) return console.log('NO USER, GO TO LOGIN');
      await vote({ id: item.id, score, user: user.name, password_hash: user.password_hash });
      var newItemScore = itemScore + score;
      if (score === 0) newItemScore = itemScore - userScore;
      setItemScore(newItemScore);
      setUserScore(score);
      setLoading(false);
    } catch (error) {
      console.log('ADD_SCORE_ERROR: ', error);
      setLoading(false);
    }
  };

  return (
    <Layout level={level} style={{ flexDirection: 'row' }}>
      {loading === item.id ? (
        <ActivityIndicator />
      ) : (
        <OverflowMenu anchor={menuAnchor} visible={menuVisible} onBackdropPress={toggleMenu}>
          <MenuItem
            key="1"
            accessoryLeft={StarIconGood}
            title={<Text category="c1">Good</Text>}
            onPress={() => addScore(1)}
          />
          <MenuItem
            key="2"
            accessoryLeft={StarIconGreat}
            title={<Text category="c1">Great</Text>}
            onPress={() => addScore(2)}
          />
          <MenuItem
            key="3"
            accessoryLeft={StarIconFav}
            title={<Text category="c1">Favorite</Text>}
            onPress={() => addScore(3)}
          />
          <MenuItem
            key="4"
            accessoryLeft={CloseIcon}
            title={<Text category="c1">Clear</Text>}
            onPress={() => addScore(0)}
          />
        </OverflowMenu>
      )}
      <OverflowMenu anchor={menuAnchor2} visible={menuVisible2} onBackdropPress={toggleMenu2}>
        <MenuItem key="5" accessoryLeft={LinkIcon} title={<Text category="c1">Copy link</Text>} />
        <MenuItem key="6" accessoryLeft={DownloadIcon} title={<Text category="c1">Download</Text>} />
        <MenuItem
          key="7"
          accessoryLeft={ArchiveIcon}
          title={<Text category="c1">Add to watch list</Text>}
          onPress={addToWatchList}
        />
        {deleteAlert && (
          <MenuItem
            key="8"
            accessoryLeft={TrashIcon}
            title={
              <Text status="primary" category="c1">
                Remove
              </Text>
            }
            onPress={remove}
          />
        )}
      </OverflowMenu>
    </Layout>
  );
};
