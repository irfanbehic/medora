import { Linking, Platform } from 'react-native';

async function open(url: string): Promise<void> {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  } catch {
    
  }
}

export const contact = {
  call: (phone: string) => open(`tel:${phone.replace(/\s+/g, '')}`),
  email: (address: string) => open(`mailto:${address}`),
  web: (url: string) => open(url),
    directions: (lat: number, lng: number, label?: string) => {
    const query = label ? encodeURIComponent(label) : `${lat},${lng}`;
    const url = Platform.select({
      ios: `https://maps.apple.com/?ll=${lat},${lng}&q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    return open(url);
  },
};
