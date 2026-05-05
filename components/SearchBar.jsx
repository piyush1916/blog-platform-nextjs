import { TextField } from "@mui/material";

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by title"
      fullWidth
      slotProps={{ htmlInput: { "aria-label": "Search by title" } }}
      sx={{
        "& .MuiOutlinedInput-root": {
          minHeight: 52,
          borderRadius: "14px",
          backgroundColor: "rgba(255,255,255,0.05)",
          color: "#e0e0ff",
          display: "flex",
          alignItems: "center",
          "& fieldset": {
            borderColor: "rgba(255,255,255,0.1)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(255,255,255,0.18)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "rgba(108,63,255,0.6)",
          },
        },
        "& .MuiOutlinedInput-input": {
          padding: "15px 18px",
          fontSize: "14px",
          lineHeight: 1.4,
        },
        "& .MuiOutlinedInput-input::placeholder": {
          color: "#555577",
          opacity: 1,
        },
      }}
    />
  );
}
