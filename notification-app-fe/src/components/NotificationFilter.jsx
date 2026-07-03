import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const filters = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      onChange(nextView);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{
        flexWrap: "wrap",
        gap: 0.5,
        border: "none",
        "& .MuiToggleButtonGroup-grouped": {
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "20px !important",
          margin: "2px",
        },
      }}
    >
      {filters.map((type) => (
        <ToggleButton
          key={type}
          value={type}
          sx={{
            textTransform: "none",
            px: 3,
            py: 0.75,
            fontSize: "0.875rem",
            fontWeight: 600,
            borderRadius: "20px",
            transition: "all 0.2s ease-in-out",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "white",
              boxShadow: "0px 4px 10px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
            }
          }}
        >
          {type}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}