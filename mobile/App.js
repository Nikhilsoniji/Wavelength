import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  BackHandler,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// Production URL deployed on Vercel
const WAVELENGTH_URL = 'https://wavelength-wheat-nu.vercel.app';

// High-compatibility mobile User-Agent to ensure uninterrupted YouTube audio & media streaming
const CUSTOM_USER_AGENT =
  Platform.OS === 'ios'
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
    : 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

// Optimized script to prevent pinch-to-zoom glitches and enable smooth mobile touches
const INJECTED_JAVASCRIPT = `
  (function() {
    // Disable callout on long press
    document.documentElement.style.webkitTouchCallout = 'none';
    document.documentElement.style.webkitUserSelect = 'none';
  })();
  true;
`;

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hardware Back Button navigation for Android
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [canGoBack]);

  const handleReload = () => {
    setHasError(false);
    setIsLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#09090B"
          translucent={false}
        />

        {hasError ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorGlow} />
            <Text style={styles.errorIcon}>⚡</Text>
            <Text style={styles.errorTitle}>Unable to connect to Wavelength</Text>
            <Text style={styles.errorSubtitle}>
              Please check your Wi-Fi or cellular data connection and try again.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleReload}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.webviewWrapper}>
            <WebView
              ref={webViewRef}
              source={{ uri: WAVELENGTH_URL }}
              style={styles.webview}
              userAgent={CUSTOM_USER_AGENT}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              databaseEnabled={true}
              cacheEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              allowsPictureInPictureMediaPlayback={true}
              allowsBackForwardNavigationGestures={true}
              injectedJavaScript={INJECTED_JAVASCRIPT}
              scalesPageToFit={true}
              bounces={false}
              overScrollMode="never"
              mixedContentMode="always"
              originWhitelist={['*']}
              onNavigationStateChange={(navState) => {
                setCanGoBack(navState.canGoBack);
              }}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={() => setHasError(true)}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                if (nativeEvent.statusCode >= 400) {
                  setHasError(true);
                }
              }}
            />

            {isLoading && (
              <View style={styles.loadingOverlay} pointerEvents="none">
                <ActivityIndicator size="large" color="#cabeff" />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  webviewWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#09090B',
  },
  webview: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#09090B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#09090B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  errorGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(250, 45, 72, 0.12)',
    filter: 'blur(30px)',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    color: '#F4F4F5',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  errorSubtitle: {
    color: '#A1A1AA',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    maxWidth: 320,
  },
  retryButton: {
    backgroundColor: '#FA2D48',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 9999,
    shadowColor: '#FA2D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
