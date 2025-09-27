// Application constants
export const APP_CONFIG = {
  SIDEBAR_WIDTH: 300,
  MODAL_WIDTH: 400,
} as const;

// Default values
export const DEFAULTS = {
  USER_POINTS: 10,
  USER_LEVEL: 1,
  // Grid positioning constants
  GRID_COLUMNS: 3,
  GRID_START_X: 50,
  GRID_START_Y: 50,
  GRID_SPACING_X: 300,
  GRID_SPACING_Y: 200,
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  NODES: 'skillTree-nodes',
  EDGES: 'skillTree-edges',
  USER_POINTS: 'skillTree-userPoints',
  USER_LEVEL: 'skillTree-userLevel',
} as const;

// UI Messages
export const MESSAGES = {
  CANNOT_ADD_PREREQUISITES: 'Cannot add prerequisites to an already unlocked skill!\n\nYou can only add prerequisites to skills that haven\'t been unlocked yet.',
  MODAL_TITLE: '⚠️ Action Not Allowed',
  MODAL_BUTTON: 'Understood',
} as const;

// Styling constants
export const COLORS = {
  PRIMARY_GRADIENT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  PRIMARY_COLOR: '#667eea',
  PRIMARY_HOVER: '#764ba2',
  ERROR_COLOR: '#f44336',
  SUCCESS_COLOR: '#4caf50',
} as const;