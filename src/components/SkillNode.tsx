import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { Button, Typography } from "@mui/material";

interface SkillNodeProps {
  data: {
    id: string;
    name: string;
    description: string;
    cost?: number;
    level?: number;
    isUnlocked: boolean;
    canUnlock: boolean;
    isHighlighted?: boolean;
    onUnlock: (id: string) => void;
  };
}

const SkillNode: React.FC<SkillNodeProps> = ({ data }) => {
  const {
    name,
    description,
    cost,
    level,
    isUnlocked,
    canUnlock,
    isHighlighted,
    onUnlock,
  } = data;

  // Simple 2-color scheme: Grey or Green only
  const getNodeStyles = () => {
    if (isUnlocked) {
      return {
        background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)", // Green gradient for unlocked
        borderColor: "#2e7d32",
        color: "white",
        boxShadow: isHighlighted
          ? "0 6px 20px rgba(76, 175, 80, 0.6), 0 0 20px rgba(255, 215, 0, 0.8)"
          : "0 4px 12px rgba(76, 175, 80, 0.3)",
      };
    } else {
      return {
        background: "linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)", // Gray gradient for locked/unlockable
        borderColor: "#757575",
        color: "#424242",
        boxShadow: isHighlighted
          ? "0 6px 20px rgba(158, 158, 158, 0.4), 0 0 20px rgba(255, 215, 0, 0.8)"
          : "0 2px 6px rgba(158, 158, 158, 0.2)",
      };
    }
  };

  const nodeStyles = getNodeStyles();

  return (
    <div
      className="skill-node"
      style={{
        border: `2px solid ${nodeStyles.borderColor}`,
        borderRadius: "12px",
        padding: 12,
        width: 200,
        background: nodeStyles.background,
        color: nodeStyles.color,
        boxShadow: nodeStyles.boxShadow,
        transition: "all 0.3s ease",
        cursor: "grab",
        userSelect: "none",
        position: "relative",
      }}
      onMouseDown={(e) => {
        // Only stop propagation for button clicks, allow handles to work
        const target = e.target as HTMLElement;
        if (target && target.tagName === "BUTTON") {
          e.stopPropagation();
        }
        // Don't stop propagation for handle interactions
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          textShadow:
            isUnlocked || canUnlock ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
        }}
      >
        {name}
      </Typography>
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          opacity: 0.9,
          textShadow:
            isUnlocked || canUnlock ? "0 1px 2px rgba(0,0,0,0.2)" : "none",
        }}
      >
        {description}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: "medium",
          opacity: 0.8,
          fontSize: "0.75rem",
        }}
      >
        💎 Cost: {cost} points | ⭐ Level {level}+
      </Typography>

      <Button
        data-testid="unlock-button"
        variant="contained"
        size="small"
        fullWidth
        disabled={!canUnlock || isUnlocked}
        onClick={(e) => {
          e.stopPropagation();
          onUnlock(data.id);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        sx={{
          mt: 1.5,
          borderRadius: 2,
          fontWeight: "bold",
          textTransform: "none",
          pointerEvents: "auto",
          ...(isUnlocked && {
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.3)",
            },
          }),
          ...(canUnlock &&
            !isUnlocked && {
              background: "rgba(255, 255, 255, 0.9)",
              color: "#f57c00",
              "&:hover": {
                background: "white",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              },
            }),
          ...(!canUnlock &&
            !isUnlocked && {
              background: "rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.5)",
            }),
        }}
      >
        {isUnlocked ? "✓ Unlocked" : canUnlock ? "🔓 Unlock" : "🔒 Locked"}
      </Button>

      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        isConnectable={true}
        style={{
          background: "#2196f3",
          border: "3px solid #fff",
          width: "20px",
          height: "20px",
          top: "-10px",
          borderRadius: "50%",
          zIndex: 1000,
          cursor: "crosshair",
          pointerEvents: "all",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        isConnectable={true}
        style={{
          background: "#ff9800",
          border: "3px solid #fff",
          width: "20px",
          height: "20px",
          bottom: "-10px",
          borderRadius: "50%",
          zIndex: 1000,
          cursor: "crosshair",
          pointerEvents: "all",
        }}
      />
    </div>
  );
};

export default SkillNode;
