import { useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Button, AnimatedPressable } from '@/components';
import { Text } from '@/components/Text';
import { setItem, StorageKeys } from '@/lib/storage';
import { haptics } from '@/lib/haptics';
import { useSettings, type Locale } from '@/store/settings';
import { lightColors } from '@/theme';

type Slide = {
  key: string;
  image: number;
  titleKey: string;
  bodyKey: string;
};

const SLIDES: Slide[] = [
  { key: '1', image: require('../assets/images/onb_1.png'), titleKey: 'onboarding.slide1Title', bodyKey: 'onboarding.slide1Body' },
  { key: '2', image: require('../assets/images/onb_2.png'), titleKey: 'onboarding.slide2Title', bodyKey: 'onboarding.slide2Body' },
  { key: '3', image: require('../assets/images/onb_3.png'), titleKey: 'onboarding.slide3Title', bodyKey: 'onboarding.slide3Body' },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [index, setIndex] = useState(0);

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const isLast = index === SLIDES.length - 1;

  const finish = async () => {
    haptics.success();
    await setItem(StorageKeys.onboardingSeen, '1');
    router.replace('/(tabs)');
  };

  const next = () => {
    if (isLast) {
      void finish();
      return;
    }
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

  return (
    <View style={[styles.root, { backgroundColor: lightColors.background }]}>
      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      >
        {SLIDES.map((slide, i) => (
          <SlideView key={slide.key} slide={slide} index={i} scrollX={scrollX} width={width} />
        ))}
      </Animated.ScrollView>

      <View style={[styles.top, { top: insets.top + 8 }]}>
        <LanguageToggle />
        <AnimatedPressable haptic="selection" onPress={() => void finish()} hitSlop={8}>
          <Text variant="bodyStrong" style={{ color: lightColors.textMuted }}>
            {t('common.skip')}
          </Text>
        </AnimatedPressable>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} width={width} />
          ))}
        </View>
        <Button title={isLast ? t('common.getStarted') : t('common.next')} onPress={next} />
      </View>
    </View>
  );
}

function SlideView({
  slide,
  index,
  scrollX,
  width,
}: {
  slide: Slide;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 52;
  const imageHeight = height * 0.5;
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(scrollX.value, inputRange, [width * 0.1, 0, -width * 0.1], 'clamp') },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], 'clamp'),
    transform: [{ translateY: interpolate(scrollX.value, inputRange, [16, 0, 16], 'clamp') }],
  }));

  return (
    <View style={{ width, height }}>
      <View style={[styles.imageWrap, { height: imageHeight, marginTop: topOffset }]}>
        <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
          <Image
            source={slide.image}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="center"
          />
        </Animated.View>
        <LinearGradient
          colors={['rgba(246,248,250,0)', lightColors.background]}
          locations={[0.78, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </View>

      <Animated.View style={[styles.textArea, textStyle]}>
        <Text center style={styles.slideTitle}>
          {t(slide.titleKey)}
        </Text>
        <Text center style={styles.slideBody}>
          {t(slide.bodyKey)}
        </Text>
      </Animated.View>
    </View>
  );
}

function Dot({
  index,
  scrollX,
  width,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const style = useAnimatedStyle(() => ({
    width: interpolate(scrollX.value, inputRange, [8, 24, 8], 'clamp'),
    opacity: interpolate(scrollX.value, inputRange, [0.35, 1, 0.35], 'clamp'),
  }));
  return <Animated.View style={[styles.dot, { backgroundColor: lightColors.brand }, style]} />;
}

function LanguageToggle() {
  const locale = useSettings((s) => s.locale);
  const setLocale = useSettings((s) => s.setLocale);
  const options: Locale[] = ['en', 'tr'];

  return (
    <View style={[styles.langToggle, { backgroundColor: '#FFFFFFEE' }]}>
      {options.map((opt) => {
        const active = locale === opt;
        return (
          <AnimatedPressable
            key={opt}
            haptic="selection"
            onPress={() => setLocale(opt)}
            style={[
              styles.langOption,
              { backgroundColor: active ? lightColors.brand : 'transparent' },
            ]}
          >
            <Text variant="label" style={{ color: active ? lightColors.onBrand : lightColors.textMuted }}>
              {opt.toUpperCase()}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageWrap: {
    overflow: 'hidden',
    marginHorizontal: 16,
    borderRadius: 28,
  },
  textArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 150,
  },
  slideTitle: { fontSize: 21, lineHeight: 27, fontWeight: '700', color: lightColors.text, marginBottom: 8 },
  slideBody: { fontSize: 14, lineHeight: 20, fontWeight: '400', color: lightColors.textMuted, maxWidth: 300 },
  footer: { position: 'absolute', left: 24, right: 24, bottom: 0, gap: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  langToggle: { flexDirection: 'row', padding: 3, gap: 2, borderRadius: 999 },
  langOption: { height: 28, minWidth: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 999, paddingHorizontal: 12 },
});
