import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/design/theme';
import { BitheatText } from '@/components/ui/BitheatText';
import { BitheatButton } from '@/components/ui/BitheatButton';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Ionicons } from '@expo/vector-icons';

export default function CapturePhotoScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { setPhoto } = useRegistrationStore();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
        <BitheatText variant="heading" style={styles.title}>Camera access needed</BitheatText>
        <BitheatText variant="body" style={styles.subtitle}>
          We need camera access to capture the child's photo for their health passport.
        </BitheatText>
        <BitheatButton label="Grant Permission" onPress={requestPermission} />
        <BitheatButton label="Skip for now" variant="ghost" onPress={() => router.push('/(chw)/register/generating')} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      setCapturedImage(photo.uri);
    }
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      // In a real app, generate a hash of the photo for IPFS
      setPhoto(capturedImage, `hash_${Date.now()}`);
      router.push('/(chw)/register/generating');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { padding: spacing.lg }]}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color={colors.text} />
           </TouchableOpacity>
           <TouchableOpacity onPress={() => router.push('/(chw)/register/generating')}>
             <BitheatText variant="body" color={colors.primary} style={{ fontWeight: '600' }}>Skip</BitheatText>
           </TouchableOpacity>
        </View>

        <View style={styles.progress}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
          <View style={[styles.dot, { backgroundColor: colors.surface }]} />
        </View>

        <BitheatText variant="heading" style={styles.title}>Child's photo</BitheatText>

        <View style={styles.content}>
          {capturedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: capturedImage }} style={styles.preview} />
              <View style={styles.previewActions}>
                <BitheatButton label="Use photo" onPress={handleUsePhoto} style={{ flex: 1 }} />
                <BitheatButton label="Retake" variant="ghost" onPress={() => setCapturedImage(null)} style={{ flex: 1 }} />
              </View>
            </View>
          ) : (
            <View style={styles.cameraWrapper}>
              <CameraView 
                ref={cameraRef}
                style={styles.camera} 
                facing="back"
              />
              <TouchableOpacity style={[styles.captureBtn, { backgroundColor: colors.primary }]} onPress={takePicture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  cameraWrapper: {
    aspectRatio: 3/4,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  captureBtn: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  previewContainer: {
    flex: 1,
    gap: 24,
  },
  preview: {
    aspectRatio: 3/4,
    width: '100%',
    borderRadius: 24,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  }
});
