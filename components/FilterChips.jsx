export default function FilterChips({ categories, activeCategory, onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {categories.map((category) => {
        const active = category === activeCategory;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            type="button"
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: active
                ? "1px solid rgba(108,63,255,0.35)"
                : "1px solid rgba(255,255,255,0.08)",
              background: active
                ? "linear-gradient(90deg, rgba(108,63,255,0.9), rgba(56,189,248,0.9))"
                : "rgba(255,255,255,0.05)",
              color: active ? "#ffffff" : "#a0a0c0",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
