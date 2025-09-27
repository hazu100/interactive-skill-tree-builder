import { type Node, type Edge } from "react-flow-renderer";
import { type SkillData } from "../types";
import { DEFAULTS } from "../constants";

/**
 * Check if a node can be unlocked based on prerequisite logic
 */
export const canNodeBeUnlocked = (
  nodeId: string,
  nodes: Node[],
  edges: Edge[]
): boolean => {
  const node = nodes.find((n) => n.id === nodeId);
  const skillData = node?.data as SkillData;
  if (!node || skillData.isUnlocked) return false;

  const hasIncomingEdges = edges.some((edge) => edge.target === nodeId);
  const hasOutgoingEdges = edges.some((edge) => edge.source === nodeId);

  // CASE 1: Node with outgoing edges but NO incoming edges = START NODE
  if (hasOutgoingEdges && !hasIncomingEdges) {
    return true;
  }

  // CASE 2: Node with incoming edges = check if ALL prerequisites are unlocked
  if (hasIncomingEdges) {
    return edges
      .filter((edge) => edge.target === nodeId)
      .every((edge) => {
        const prerequisiteNode = nodes.find((n) => n.id === edge.source);
        const prerequisiteData = prerequisiteNode?.data as SkillData;
        return prerequisiteData?.isUnlocked === true;
      });
  }

  // CASE 3: Node with no edges = cannot unlock
  return false;
};

/**
 * Check if user has sufficient points and level for a skill
 */
export const hasRequiredResources = (
  skillCost: number,
  skillLevel: number,
  userPoints: number,
  userLevel: number
): boolean => {
  return userPoints >= skillCost && userLevel >= skillLevel;
};

/**
 * Calculate grid position for new nodes
 */
export const calculateNodePosition = (
  nodeCount: number,
  columnsPerRow: number = DEFAULTS.GRID_COLUMNS
): { x: number; y: number } => {
  const x = DEFAULTS.GRID_START_X + (nodeCount % columnsPerRow) * DEFAULTS.GRID_SPACING_X;
  const y = DEFAULTS.GRID_START_Y + Math.floor(nodeCount / columnsPerRow) * DEFAULTS.GRID_SPACING_Y;
  return { x, y };
};

/**
 * Search nodes by name (case-insensitive)
 */
export const searchNodesByName = (
  nodes: Node[],
  searchTerm: string
): Node[] => {
  if (!searchTerm.trim()) return [];

  return nodes.filter((node) => {
    const skillData = node.data as SkillData;
    return skillData.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
};

/**
 * Create a new skill node with default properties
 */
export const createSkillNode = (
  id: string,
  name: string,
  description: string,
  cost: number,
  level: number,
  position: { x: number; y: number },
  onUnlock: (id: string) => void
): Node => {
  return {
    id,
    type: "skillNode" as const,
    position,
    data: {
      id,
      name,
      description,
      cost,
      level,
      isUnlocked: false,
      canUnlock: false, // Will be calculated later
      onUnlock,
    },
  };
};

/**
 * Update nodes with canUnlock status based on current state
 */
export const updateNodesUnlockStatus = (
  nodes: Node[],
  edges: Edge[],
  userPoints: number,
  userLevel: number
): Node[] => {
  return nodes.map((node) => {
    const nodeData = node.data as SkillData;

    if (nodeData.isUnlocked) {
      return { ...node, data: { ...node.data, canUnlock: false } };
    }

    const skillCost = nodeData.cost;
    const skillLevel = nodeData.level;
    const hasRequiredStats = hasRequiredResources(
      skillCost,
      skillLevel,
      userPoints,
      userLevel
    );

    const canUnlock =
      canNodeBeUnlocked(node.id, nodes, edges) && hasRequiredStats;

    return {
      ...node,
      data: { ...node.data, canUnlock },
    };
  });
};

/**
 * Restore function references to nodes loaded from localStorage
 */
export const restoreNodeFunctions = (
  nodes: Node[],
  onUnlock: (id: string) => void
): Node[] => {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onUnlock, // Restore the function reference
    },
  }));
};

/**
 * Add highlight status to nodes for search results
 */
export const addHighlightToNodes = (
  nodes: Node[],
  highlightedNodeIds: string[]
): Node[] => {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      isHighlighted: highlightedNodeIds.includes(node.id),
    },
  }));
};
