export interface SkillData {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  isUnlocked: boolean;
  canUnlock?: boolean;
  onUnlock?: (id: string) => void;
  isHighlighted?: boolean;
}
