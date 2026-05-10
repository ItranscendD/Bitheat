import vaccineData from '../assets/data/who-epi-vaccines.json';

export interface VaccineStatus {
  id: string;
  name: string;
  dose: number;
  status: 'complete' | 'due' | 'overdue';
  date?: string;
  dueDate: string;
}

/**
 * Calculates the vaccination status for a child based on their DOB and history
 */
export const calculateDueVaccines = (childDOB: string, careEvents: any[]): VaccineStatus[] => {
  const dob = new Date(childDOB);
  const now = new Date();
  const statuses: VaccineStatus[] = [];

  const completedVaccines = careEvents
    .filter(e => e.type === 'vaccination')
    .map(e => {
      const details = JSON.parse(e.details_json);
      return { id: details.vaccineId, dose: details.dose };
    });

  vaccineData.vaccines.forEach(v => {
    v.schedule.forEach(s => {
      const dueDate = new Date(dob);
      dueDate.setDate(dueDate.getDate() + s.age_days);
      
      const isComplete = completedVaccines.some(cv => cv.id === v.id && cv.dose === s.dose);
      
      let status: 'complete' | 'due' | 'overdue' = 'due';
      if (isComplete) {
        status = 'complete';
      } else if (dueDate < now) {
        status = 'overdue';
      } else {
        // Due soon check (within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        if (dueDate <= thirtyDaysFromNow) {
          status = 'due';
        } else {
          // Future due - maybe don't show or mark differently
          return;
        }
      }

      statuses.push({
        id: v.id,
        name: v.name,
        dose: s.dose,
        status,
        dueDate: dueDate.toISOString().split('T')[0]
      });
    });
  });

  return statuses;
};

/**
 * Gets days remaining until or since a vaccine was due
 */
export const getDaysDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = now.getTime() - due.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
