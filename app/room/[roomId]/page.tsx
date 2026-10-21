import RoomView from "@/features/room/components/RoomView";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** /room/{roomId}[?machine={machineId}] — student room view; ?machine= is the per-machine QR deep link (P2-001). */
export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { roomId } = await params;
  const { machine } = await searchParams;
  const highlightMachineId = (Array.isArray(machine) ? machine[0] : machine) ?? null;
  return <RoomView roomId={roomId} highlightMachineId={highlightMachineId} />;
}
