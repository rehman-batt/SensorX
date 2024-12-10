import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

// initialize dotenv
dotenv.config();

module.exports = ({ config }) => {
    return {
      ...config,
      android: {
        config: {
          googleMaps: {
            apiKey: process.env.GOOGLEMAPS_APIKEY,
          },
        },
        permissions: [
          "android.permission.ACCESS_COARSE_LOCATION",
          "android.permission.ACCESS_FINE_LOCATION",
          "HIGH_SAMPLING_RATE_SENSORS",
          "android.permission.CAMERA",
          "android.permission.RECORD_AUDIO",
          "android.permission.READ_EXTERNAL_STORAGE",
          "android.permission.WRITE_EXTERNAL_STORAGE",
          "android.permission.ACCESS_MEDIA_LOCATION"
        ],
        package: "com.rehmanbatt.SensorX",
        googleServicesFile: "./google-services.json"
      },
      
    
    };
  };