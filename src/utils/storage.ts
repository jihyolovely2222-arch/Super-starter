import { INITIAL_SEASONS } from '../data/defaultData';
import { Season } from '../types';

const STORAGE_KEY = 'seishun_academy_archive_v2';

export function loadSeasons(): Season[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveSeasons(INITIAL_SEASONS);
      return INITIAL_SEASONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SEASONS;
  } catch (err) {
    console.error('Failed to load seasons from localStorage', err);
    return INITIAL_SEASONS;
  }
}

export function saveSeasons(seasons: Season[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seasons));
  } catch (err) {
    console.error('Failed to save seasons to localStorage', err);
  }
}

export function resetToDefault(): Season[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEASONS));
    return INITIAL_SEASONS;
  } catch (err) {
    console.error('Failed to reset data', err);
    return INITIAL_SEASONS;
  }
}
