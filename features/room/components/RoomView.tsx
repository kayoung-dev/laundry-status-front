import SiteShell from "@/components/layout/SiteShell";
import RoomDashboard from "./RoomDashboard";

interface RoomViewProps {
  roomId: string;
  /** P2-001: machine from the per-machine QR deep link (?machine=), highlighted and scrolled into view. */
  highlightMachineId: string | null;
}

/** `/room/{roomId}` — design canvas "세탁실 현황" (web 1440 / mobile 390). */
export default function RoomView({ roomId, highlightMachineId }: RoomViewProps) {
  return (
    <SiteShell active="room">
      <RoomDashboard roomId={roomId} highlightMachineId={highlightMachineId} />
    </SiteShell>
  );
}
