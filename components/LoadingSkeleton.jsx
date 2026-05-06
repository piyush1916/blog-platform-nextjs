import { Skeleton, Stack } from "@mui/material";

export default function LoadingSkeleton({ count = 6, variant = "grid" }) {
  if (variant === "detail") {
    return (
      <div className="glass-card rounded-[20px] border border-white/10 bg-white/5 p-8">
        <Skeleton variant="rounded" width="28%" height={18} sx={{ mb: 3 }} />
        <Skeleton variant="text" width="72%" height={54} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={54} sx={{ mb: 4 }} />
        <Skeleton variant="rounded" width="100%" height={14} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="96%" height={14} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="94%" height={14} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="92%" height={14} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="88%" height={14} sx={{ mb: 5 }} />
        <div className="flex justify-center">
          <Skeleton variant="rounded" width={220} height={52} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.04)] p-5"
        >
          <Skeleton variant="rounded" width="36%" height={22} sx={{ mb: 3 }} />
          <Stack spacing={1.1}>
            <Skeleton variant="text" width="85%" height={24} />
            <Skeleton variant="text" width="92%" height={24} />
            <Skeleton variant="text" width="74%" height={20} sx={{ mb: 1.5 }} />
            <Skeleton variant="rounded" width="100%" height={68} sx={{ mb: 2 }} />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={26} height={26} />
                <div className="space-y-2">
                  <Skeleton variant="text" width={92} height={16} />
                  <Skeleton variant="text" width={68} height={14} />
                </div>
              </div>
              <Skeleton variant="rounded" width={108} height={34} />
            </div>
          </Stack>
        </div>
      ))}
    </div>
  );
}
