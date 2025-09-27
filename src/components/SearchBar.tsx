import React, { useState } from "react";
import {
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Chip,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onClear: () => void;
  matchCount?: number;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  matchCount = 0,
  placeholder = "Search skills by name or description...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onClear();
  };

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: 2,
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "white",
            borderRadius: 2,
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.4)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.6)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 255, 255, 0.8)",
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.7)",
            opacity: 1,
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {searchTerm && (
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            size="small"
            label={`${matchCount} result${matchCount !== 1 ? "s" : ""} found`}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: "500",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          />
          {searchTerm.length > 0 && (
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "400",
                fontStyle: "italic",
              }}
            >
              Searching for: "{searchTerm}"
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
