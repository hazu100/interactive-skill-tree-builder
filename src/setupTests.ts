import "@testing-library/jest-dom";
import React from "react";

// TypeScript interfaces for mocking
interface NodeData {
  name: string;
  description: string;
  cost: number;
  level: number;
  isUnlocked: boolean;
  canUnlock: boolean;
  onUnlock?: (id: string) => void;
}

interface MockNode {
  id: string;
  type: string;
  data: NodeData;
}

interface ReactFlowProps {
  nodes?: MockNode[];
  children?: React.ReactNode;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface ComponentProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  open?: boolean;
  component?: string;
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
  placeholder?: string;
  helperText?: string;
  position?: string;
  [key: string]: unknown;
}

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn(),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock Material-UI icons
jest.mock("@mui/icons-material", () => ({
  Search: () => React.createElement("span", { "data-testid": "search-icon" }, "🔍"),
  Clear: () => React.createElement("span", { "data-testid": "clear-icon" }, "✕"),
  Close: () => React.createElement("span", { "data-testid": "close-icon" }, "✕"),
}));

// Mock uuid
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-1234"),
}));

// Mock react-flow-renderer (version 10.x)
jest.mock("react-flow-renderer", () => ({
  __esModule: true,
  default: React.forwardRef<HTMLDivElement, ReactFlowProps>((props) => {
    const { nodes = [] } = props;
    return React.createElement(
      "div",
      { "data-testid": "react-flow" },
      ...nodes.map((node: MockNode) => {
        if (node.type === "skillNode") {
          return React.createElement(
            "div",
            {
              key: node.id,
              className: "skill-node",
              "data-testid": `skill-node-${node.id}`,
              style: {
                border: `2px solid ${node.data.isUnlocked ? '#4caf50' : '#757575'}`,
                borderRadius: "12px",
                padding: "12px",
                width: "200px",
                background: node.data.isUnlocked 
                  ? "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)"
                  : "linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)",
                color: node.data.isUnlocked ? "white" : "#424242",
                boxShadow: `0 2px 6px ${node.data.isUnlocked ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)'}`,
                transition: "all 0.3s ease",
                cursor: "grab",
                userSelect: "none",
                position: "relative",
              }
            },
            // Node title
            React.createElement(
              "div",
              { "data-testid": "typography", variant: "subtitle1", sx: {} },
              node.data.name
            ),
            // Node description  
            React.createElement(
              "div",
              { "data-testid": "typography", variant: "body2", sx: {} },
              node.data.description
            ),
            // Node cost/level info
            React.createElement(
              "div",
              { "data-testid": "typography", variant: "body2", sx: {} },
              `💎 Cost: ${node.data.cost} points | ⭐ Level ${node.data.level}+`
            ),
            // Unlock button
            React.createElement(
              "button",
              {
                "data-testid": "unlock-button",
                variant: "contained",
                sx: {},
                disabled: !node.data.canUnlock,
                onClick: () => {
                  if (node.data.onUnlock) {
                    node.data.onUnlock(node.id);
                  }
                }
              },
              node.data.isUnlocked ? "🔓 Unlocked" : 
              node.data.canUnlock ? "🔓 Unlock" : "🔒 Locked"
            ),
            // Target handle (top)
            React.createElement("div", {
              "data-testid": "react-flow-handle",
              type: "target",
              position: "top",
              id: "target-top",
              style: {
                background: "#2196f3",
                border: "3px solid #fff", 
                width: 20,
                height: 20,
                top: -10,
                borderRadius: "50%",
                zIndex: 1000,
                cursor: "crosshair",
                pointerEvents: "all",
              },
            }),
            // Source handle (bottom)
            React.createElement("div", {
              "data-testid": "react-flow-handle",
              type: "source", 
              position: "bottom",
              id: "source-bottom",
              style: {
                background: "#ff9800",
                border: "3px solid #fff",
                width: 20,
                height: 20,
                bottom: -10, 
                borderRadius: "50%",
                zIndex: 1000,
                cursor: "crosshair",
                pointerEvents: "all",
              },
            })
          );
        }
        return null;
      })
    );
  }),
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      "div",
      { "data-testid": "react-flow-provider" },
      children
    ),
  useNodesState: jest.fn((initialNodes: MockNode[]) => {
    const [nodes, setNodes] = React.useState<MockNode[]>(initialNodes || []);
    const onNodesChange = jest.fn(() => {
      // Handle node changes if needed for more complex scenarios
    });
    return [nodes, setNodes, onNodesChange];
  }),
  useEdgesState: jest.fn((initialEdges: Edge[]) => {
    const [edges, setEdges] = React.useState<Edge[]>(initialEdges || []);
    const onEdgesChange = jest.fn(() => {
      // Handle edge changes if needed for more complex scenarios  
    });
    return [edges, setEdges, onEdgesChange];
  }),
  addEdge: jest.fn((edge: Edge, edges: Edge[]) => [...edges, edge]),
  Background: () =>
    React.createElement("div", { "data-testid": "react-flow-background" }),
  Controls: () =>
    React.createElement("div", { "data-testid": "react-flow-controls" }),
  Handle: (props: ComponentProps) =>
    React.createElement("div", {
      "data-testid": "react-flow-handle",
      ...props,
    }),
  Position: {
    Top: "top",
    Bottom: "bottom",
    Left: "left",
    Right: "right",
  },
}));

// Mock Material-UI components
jest.mock("@mui/material", () => ({
  Modal: ({ children, open }: ComponentProps) =>
    open
      ? React.createElement(
          "div",
          { role: "dialog", "data-testid": "modal" },
          children
        )
      : null,
  Box: ({
    children,
    component = "div",
    ...props
  }: ComponentProps) =>
    React.createElement(component, { "data-testid": "box", ...props }, children),
  Typography: ({
    children,
    ...props
  }: ComponentProps) =>
    React.createElement(
      "div",
      { "data-testid": "typography", ...props },
      children
    ),
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: ComponentProps) =>
    React.createElement(
      "button",
      { onClick, disabled, "data-testid": "button", ...props },
      children
    ),
  IconButton: ({
    children,
    onClick,
    ...props
  }: ComponentProps) => {
    // Extract accessible name from children (for icons like Clear)
    let accessibleName = "";
    if (React.isValidElement(children) && children.props) {
      const childProps = children.props as ComponentProps;
      if (childProps["data-testid"] === "clear-icon") {
        accessibleName = "clear";
      } else if (childProps["data-testid"] === "search-icon") {
        accessibleName = "search";
      } else if (childProps["data-testid"] === "close-icon") {
        accessibleName = "close";
      }
    }
    
    return React.createElement(
      "button",
      { 
        onClick, 
        "data-testid": "icon-button",
        "aria-label": accessibleName,
        ...props 
      },
      children
    );
  },
  TextField: ({
    label,
    value,
    onChange,
    name,
    type,
    placeholder,
    helperText,
    ...props
  }: ComponentProps) =>
    React.createElement("input", {
      "aria-label": label,
      value,
      onChange,
      name,
      type,
      placeholder,
      title: helperText,
      "data-testid": "textfield",
      ...props
    }),
  Paper: ({
    children,
    ...props
  }: ComponentProps) =>
    React.createElement("div", { "data-testid": "paper", ...props }, children),
  InputAdornment: ({
    children,
    position,
    ...props
  }: ComponentProps) =>
    React.createElement(
      "div",
      { "data-testid": `input-adornment-${position}`, ...props },
      children
    ),
  Chip: ({
    label,
    ...props
  }: ComponentProps) =>
    React.createElement(
      "div",
      { "data-testid": "chip", ...props },
      label
    ),
}));

// Mock Material-UI icons
jest.mock("@mui/icons-material/Close", () => {
  const CloseIcon = () =>
    React.createElement("span", { "data-testid": "close-icon" }, "Close");
  CloseIcon.displayName = "CloseIcon";
  return CloseIcon;
});

// Use real custom components for integration testing
// This gives us better confidence that the actual UI works with App.tsx

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Reset localStorage mock
  localStorageMock.clear();
});
