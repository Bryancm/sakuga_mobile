import React from 'react';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { tagStyles } from '../styles';

const MoreIcon = (props) => <Icon {...props} name="more-horizontal-outline" />;
const ChevronDownIcon = (props) => (
  <Icon name="arrow-ios-downward-outline" style={{ width: 18, height: 18 }} fill="#808080" />
);
const ChevronUpIcon = (props) => (
  <Icon name="arrow-ios-upward-outline" style={{ width: 18, height: 18 }} fill="#808080" />
);

export const TagList = ({ tags, style }) => {
  const [more, setMore] = React.useState();
  const tgs = more ? tags : tags.slice(0, 7);
  const toggleMore = () => {
    setMore(!more);
  };
  return (
    <Layout level="2" style={style}>
      {tgs.length > 0 &&
        tgs.map((t, i) =>
          t.style ? (
            <Layout level="2" key={i} style={{ ...t.style, marginRight: 4, marginBottom: 8 }}>
              <Text category="c1" style={{ color: t.style.color }} numberOfLines={1}>
                {`${t.tag ? t.tag : t}  ${i}`}
              </Text>
            </Layout>
          ) : (
            <Layout level="2" key={i} style={{ ...tagStyles.basic_outline, marginRight: 4, marginBottom: 8 }}>
              <Text category="c1" numberOfLines={1}>
                {t.tag ? t.tag : t}
              </Text>
            </Layout>
          ),
        )}
      {tags.length > 7 && (
        <Button
          size="small"
          status="basic"
          appearance="ghost"
          accessoryRight={more ? ChevronUpIcon : ChevronDownIcon}
          style={{ paddingHorizontal: 0, paddingVertical: 0 }}
          onPress={toggleMore}
        />
      )}
    </Layout>
  );
};
