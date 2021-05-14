import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { tagStyles } from '../styles';

export const TagList = ({ tags, style }) => {
  return (
    <Layout level="2" style={style}>
      {tags.length > 0 &&
        tags.map((t, i) =>
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
    </Layout>
  );
};
