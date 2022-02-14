import React, { useCallback, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RangeSlider from 'rn-range-slider';
import Thumb from './thumb';
import Rail from './rail';
import RailSelected from './railSelected';
import Label from './label';
import Notch from './notch';

export const Slider = ({
  duration,
  currentTime,
  setPositionAsync,
  usingSlider,
  setUsingSlider,
  setEndTime,
  setStartTime,
  setPaused,
}) => {
  const mounted = useRef(true);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(duration);
  const [rangeChanged, setRangeChanged] = useState(null);
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const renderLabel = useCallback((value) => <Label text={millisToMinutesAndSeconds(value * 1000)} />, []);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!usingSlider) setLow(currentTime);
  }, [currentTime, usingSlider]);

  useEffect(() => {
    if (!usingSlider) {
      if (rangeChanged === 'high') {
        setPositionAsync(low, true);
      }
      if (rangeChanged) setRangeChanged(null);
    }
  }, [usingSlider, rangeChanged, low]);

  const handleValueChange = useCallback(
    (l, h, fromUser) => {
      if (fromUser) {
        setLow(l);
      }
      if (fromUser) {
        setHigh(h);
      }
      if (l !== low && fromUser) {
        setRangeChanged('low');
      }
      if (h !== high && fromUser) {
        setRangeChanged('high');
      }
    },
    [low, high],
  );

  const onTouchStart = useCallback(() => {
    setUsingSlider(true);
    setPaused(true);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (rangeChanged === 'low') {
      setPositionAsync(low);
      setStartTime(low);
    }
    if (rangeChanged === 'high') {
      setPositionAsync(high);
      setEndTime(high);
    }
  }, [rangeChanged, low, high]);

  const millisToMinutesAndSeconds = useCallback((millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    const m = minutes <= 9 ? `0${minutes}` : minutes;
    return m + ':' + (seconds < 10 ? '0' : '') + seconds;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.rangeContainer}>
        <Text style={styles.title}>{`${millisToMinutesAndSeconds(low * 1000)}`}</Text>
        <View style={{ width: '80%' }}>
          <RangeSlider
            min={0}
            max={duration}
            step={1}
            low={low}
            high={high}
            floatingLabel={true}
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            renderNotch={renderNotch}
            onValueChanged={handleValueChange}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        </View>
        <Text style={styles.title}>{`${millisToMinutesAndSeconds(duration * 1000)}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },
  rangeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SourceSansPro_900Black',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
  },
  button: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    position: 'absolute',
    fontFamily: 'SourceSansPro_900Black',
    color: '#d72323',
    fontSize: 12,
    bottom: 8,
    right: 52,
  },
});
