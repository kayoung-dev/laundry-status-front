import SiteShell from "@/components/layout/SiteShell";
import LocationScreen from "./LocationScreen";

interface LocationViewProps {
  hallId: string | null;
  floor: number | null;
}

/** `/location` — design canvas "세탁실 위치" (web 1440 / mobile 390). */
export default function LocationView({ hallId, floor }: LocationViewProps) {
  return (
    <SiteShell active="location">
      <LocationScreen hallId={hallId} floor={floor} />
    </SiteShell>
  );
}
