import { Box, Button } from "@mui/material";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
      <Button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        sx={buttonStyles(page === 1, false)}
      >
        Previous
      </Button>
      {pages.map((item) => (
        <Button
          key={item}
          onClick={() => onChange(item)}
          sx={buttonStyles(false, item === page)}
        >
          {item}
        </Button>
      ))}
      <Button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        sx={buttonStyles(page === totalPages, false)}
      >
        Next
      </Button>
    </Box>
  );
}

function buttonStyles(disabled, active) {
  return {
    minWidth: 46,
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.08)",
    px: 2,
    color: active ? "#a78bfa" : "#c5c7f2",
    backgroundColor: active ? "rgba(108,63,255,0.25)" : "rgba(255,255,255,0.03)",
    opacity: disabled ? 0.45 : 1,
    "&:hover": {
      backgroundColor: active ? "rgba(108,63,255,0.25)" : "rgba(255,255,255,0.06)",
      borderColor: active ? "rgba(108,63,255,0.3)" : "rgba(255,255,255,0.12)",
    },
  };
}
