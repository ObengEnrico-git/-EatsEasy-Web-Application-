import React from "react";
import { TextField, MenuItem } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';

function FloatingLabelInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  options = [],
  unit = "",
  required = false,
  error = "",
  helperText = "",
  onPaste,
  onKeyDown,
  ...rest
}) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {type === "select" ? (
        <TextField
          id={id}
          select
          label={label}
          variant="outlined"
          value={value}
          onChange={onChange}
          required={required}
          fullWidth
          error={Boolean(error)} // Display red border if error exists
          helperText={error || helperText} // Show error or default helper text
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-helper-text`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={value ? "true" : "false"}
          {...rest}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
        borderColor: "black",  
        borderWidth: "2px",    
      },
       "&:hover fieldset": {
        borderColor: "#1976d2",  
        borderWidth: "3px",  
      },
        "&.Mui-focused fieldset": {
       
        borderWidth: "3px",  
      }
              
            },
          }}
        >
          <MenuItem value="" disabled aria-disabled="true">
            {label}
          </MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          id={id}
          label={label + " " + unit}
          variant="outlined"
          value={value}
          onChange={onChange}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
         required={required}
          fullWidth
          error={Boolean(error)}
          helperText={
              <span id="weight-helper-text" aria-live="assertive">
                    {error || ""}
                       </span>
                         }
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-helper-text`}
          
           slotProps={{
            input: {
              endAdornment: unit && (
                <InputAdornment position="end" >{unit}</InputAdornment>
              ),
            },
          }}
          
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
        borderColor: "black",  
        borderWidth: "2px",    
      },
       "&:hover fieldset": {
        borderColor: "#1976d2",  
        borderWidth: "3px",  
      },
        "&.Mui-focused fieldset": {
       
        borderWidth: "3px",  
      }
              
            },
          }}
        />

        
      )}
      
    </div>
  );
}

export default FloatingLabelInput;
