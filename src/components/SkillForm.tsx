import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

interface Props {
  onAdd: (
    name: string,
    description: string,
    cost: number,
    level: number
  ) => void;
}

const initialFormState = {
  name: "",
  description: "",
  cost: 0, // Default cost
  level: 1, // Default level requirement
};

const SkillForm: React.FC<Props> = ({ onAdd }) => {
  const [formValues, setFormValues] = useState(initialFormState);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { name, description, cost, level } = formValues;
    if (name.trim()) {
      onAdd(name, description, cost, level);
      // Reset form after submission
      setFormValues(initialFormState);
    }
  };

  const handleChangeFormValues = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name;
    const value = event.target.type === "number" 
      ? Number(event.target.value) || 0
      : event.target.value;
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        '& .MuiTypography-root': {
          color: 'white'
        },
        '& .MuiTextField-root': {
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: 'white'
            }
          },
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.8)'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white'
            }
          },
          '& .MuiFormHelperText-root': {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add New Skill
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          name="name"
          label="Skill Name"
          value={formValues.name}
          onChange={handleChangeFormValues}
          required
          fullWidth
          size="small"
        />
        <TextField
          name="description"
          label="Description"
          value={formValues.description}
          onChange={handleChangeFormValues}
          fullWidth
          required
          size="small"
          multiline
          rows={2}
        />
        <TextField
          name="cost"
          label="Cost (Points)"
          type="number"
          value={formValues.cost}
          onChange={handleChangeFormValues}
          fullWidth
          size="small"
          slotProps={{
            htmlInput: { min: 0, max: 10 },
          }}
          helperText="Points required to unlock this skill"
        />
        <TextField
          name="level"
          label="Level Requirement"
          type="number"
          value={formValues.level}
          onChange={handleChangeFormValues}
          fullWidth
          size="small"
          slotProps={{
            htmlInput: { min: 1, max: 10 },
          }}
          helperText="Minimum level required to unlock"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="medium"
          disabled={!formValues.name.trim() || !formValues.description.trim()}
        >
          Add Skill
        </Button>
      </Box>
    </Paper>
  );
};

export default SkillForm;
