import { useCallback, useState, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "react-flow-renderer";
import { v4 as uuidv4 } from "uuid";

import SkillNode from "./components/SkillNode";
import SkillForm from "./components/SkillForm";
import type { SkillData } from "./types";
import SearchBar from "./components/SearchBar";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  STORAGE_KEYS,
  DEFAULTS,
  MESSAGES,
  APP_CONFIG,
  COLORS,
} from "./constants";
import {
  canNodeBeUnlocked,
  hasRequiredResources,
  calculateNodePosition,
  searchNodesByName,
  createSkillNode,
  updateNodesUnlockStatus,
  restoreNodeFunctions,
  addHighlightToNodes,
} from "./utils/treeUtils";

const nodeTypes = { skillNode: SkillNode };

function App() {
  // Use localStorage for persistent skill tree data
  const [savedNodes, setSavedNodes] = useLocalStorage<Node<SkillData>[]>(
    STORAGE_KEYS.NODES,
    []
  );
  const [savedEdges, setSavedEdges] = useLocalStorage<Edge[]>(
    STORAGE_KEYS.EDGES,
    []
  );
  const [userPoints, setUserPoints] = useLocalStorage<number>(
    STORAGE_KEYS.USER_POINTS,
    DEFAULTS.USER_POINTS
  );
  const [userLevel, setUserLevel] = useLocalStorage<number>(
    STORAGE_KEYS.USER_LEVEL,
    DEFAULTS.USER_LEVEL
  );

  // Initialize ReactFlow state with localStorage data
  const [nodes, setNodes, onNodesChange] = useNodesState(savedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(savedEdges);

  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);

  // Modal state for error messages
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  const handleUnlock = useCallback(
    (id: string) => {
      // Get current edges using the state updater pattern
      setEdges((currentEdges) => {
        setNodes((prevNodes) => {
          const node = prevNodes.find((n) => n.id === id);
          if (!node) return prevNodes;

          const skillData = node.data;
          const skillCost = skillData.cost;
          const skillLevel = skillData.level;

          // Check if node can be unlocked using current edges
          if (!canNodeBeUnlocked(id, prevNodes, currentEdges)) {
            return prevNodes;
          }

          // Check if user has enough points and level
          if (
            !hasRequiredResources(skillCost, skillLevel, userPoints, userLevel)
          ) {
            return prevNodes;
          }

          // Unlock the skill
          setUserPoints((prev) => prev - skillCost);
          setUserLevel((prev) => prev + 1);

          return prevNodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, isUnlocked: true } } : n
          );
        });

        // Return edges unchanged
        return currentEdges;
      });
    },
    [userPoints, userLevel, setNodes, setEdges, setUserPoints, setUserLevel]
  );

  const handleAddSkill = (
    name: string,
    description: string,
    cost: number,
    level: number
  ) => {
    const id = uuidv4();
    const position = calculateNodePosition(nodes.length);
    const newNode = createSkillNode(
      id,
      name,
      description,
      cost,
      level,
      position,
      handleUnlock
    );

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const handleConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      // Check if target node is already unlocked
      const targetNode: Node<SkillData> | undefined = nodes.find(
        (n) => n.id === params.target
      );
      if (targetNode && targetNode.data.isUnlocked) {
        // Show modal warning
        setModalMessage(MESSAGES.CANNOT_ADD_PREREQUISITES);
        setShowModal(true);
        return;
      }

      const newEdge: Edge = {
        id: uuidv4(),
        source: params.source,
        target: params.target,
        type: "smoothstep",
      };

      setEdges((prevEdges) => addEdge(newEdge, prevEdges));
    },
    [nodes, setEdges]
  );

  // Search functionality handlers
  const handleSearch = (searchValue: string) => {
    if (!searchValue.trim()) {
      setHighlightedNodes([]);
      return;
    }

    const matchingNodes = searchNodesByName(nodes, searchValue);
    setHighlightedNodes(matchingNodes.map((node) => node.id));
  };

  const handleClearSearch = () => {
    setHighlightedNodes([]);
  };

  // Recalculate canUnlock status whenever edges or user stats change
  useEffect(() => {
    setNodes((prevNodes) =>
      updateNodesUnlockStatus(prevNodes, edges, userPoints, userLevel)
    );
  }, [edges, userPoints, userLevel, nodes.length, setNodes]);

  // Restore onUnlock function to nodes loaded from localStorage
  useEffect(() => {
    setNodes((prevNodes) => restoreNodeFunctions(prevNodes, handleUnlock));
  }, [handleUnlock, setNodes]);

  // Sync ReactFlow state with localStorage
  useEffect(() => {
    setSavedNodes(nodes);
  }, [nodes, setSavedNodes]);

  useEffect(() => {
    setSavedEdges(edges);
  }, [edges, setSavedEdges]);

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <div
        style={{
          width: APP_CONFIG.SIDEBAR_WIDTH,
          padding: 20,
          background: COLORS.PRIMARY_GRADIENT,
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: 20,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            fontSize: "1.5rem",
          }}
        >
          🎯 Skill Tree
        </h2>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          matchCount={highlightedNodes.length}
          placeholder="Search skills..."
        />
        <SkillForm onAdd={handleAddSkill} />
        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 12,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <p style={{ color: "white", fontWeight: "bold", margin: "5px 0" }}>
            💎 Points: {userPoints}
          </p>
          <p style={{ color: "white", fontWeight: "bold", margin: "5px 0" }}>
            ⭐ Level: {userLevel}
          </p>
          <p
            style={{
              color: "white",
              fontSize: "14px",
              margin: "5px 0",
              opacity: 0.8,
            }}
          >
            🎯 Skills: {nodes.length}
          </p>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={addHighlightToNodes(nodes, highlightedNodes)}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Error Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: APP_CONFIG.MODAL_WIDTH,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              id="error-modal-title"
              variant="h6"
              component="h2"
              sx={{ color: COLORS.ERROR_COLOR }}
            >
              {MESSAGES.MODAL_TITLE}
            </Typography>
            <IconButton onClick={() => setShowModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography
            id="error-modal-description"
            sx={{ mb: 3, whiteSpace: "pre-line" }}
          >
            {modalMessage}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setShowModal(false)}
            sx={{
              bgcolor: COLORS.PRIMARY_COLOR,
              "&:hover": { bgcolor: COLORS.PRIMARY_HOVER },
            }}
          >
            {MESSAGES.MODAL_BUTTON}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
