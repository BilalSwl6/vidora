import { ToastAndroid, Platform } from 'react-native';

export function showToast(message: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
        // For iOS, you can use a third-party library or a custom component
        // For now, fallback to alert
        alert(message);
    }
}
