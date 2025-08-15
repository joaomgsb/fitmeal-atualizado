import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'FitMeal',
  webDir: 'dist',
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  },
  android: {
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE'
    ]
  }
};

export default config;
