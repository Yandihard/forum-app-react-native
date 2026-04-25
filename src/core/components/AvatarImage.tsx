import React, { useState, useEffect } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface AvatarImageProps {
  uri?: string;
  name?: string;
  size: number;
  className?: string;
  style?: StyleProp<ImageStyle>;
}

const AvatarImage = ({ uri, name, size, className, style }: AvatarImageProps) => {
  const fallbackUri = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff&size=${size * 2}&format=png`;
  const [sourceUri, setSourceUri] = useState(uri && uri.trim() !== "" ? uri : fallbackUri);
  const [hasError, setHasError] = useState(false);

  // Reset error and update source if uri changes
  useEffect(() => {
    setHasError(false);
    setSourceUri(uri && uri.trim() !== "" ? uri : fallbackUri);
  }, [uri, name]);

  return (
    <Image
      source={{ uri: hasError ? fallbackUri : sourceUri }}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
};

export default AvatarImage;
