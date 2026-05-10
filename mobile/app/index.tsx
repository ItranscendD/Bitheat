import { Redirect } from 'expo-router';

export default function Index() {
  // Logic to determine if user is authenticated or needs onboarding
  // For now, redirect to auth group
  return <Redirect href="/(auth)/onboarding" />;
}
