import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { runSyncCycle } from './syncEngine';

const SYNC_TASK_NAME = 'BITHEAT_BACKGROUND_SYNC';

// Define the task
TaskManager.defineTask(SYNC_TASK_NAME, async () => {
  try {
    const result = await runSyncCycle();
    console.log('Background sync result:', result);
    return result.success ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('Background sync failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Registers the background sync task
 */
export const registerBackgroundSync = async () => {
  return BackgroundFetch.registerTaskAsync(SYNC_TASK_NAME, {
    minimumInterval: 15 * 60, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

/**
 * Manually triggers an immediate sync cycle
 */
export const triggerImmediateSync = async () => {
  return runSyncCycle();
};

/**
 * Unregisters the background sync task
 */
export const unregisterBackgroundSync = async () => {
  return BackgroundFetch.unregisterTaskAsync(SYNC_TASK_NAME);
};
