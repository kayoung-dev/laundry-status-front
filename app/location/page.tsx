import type { Metadata } from "next";
import LocationView from "@/features/location/components/LocationView";
import { findHall, findLaundry } from "@/features/location/utils";

interface LocationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function first(value: string | string[] | undefined): string | null {
  return (Array.isArray(value) ? value[0] : value) ?? null;
}

async function readParams(searchParams: LocationPageProps["searchParams"]) {
  const { hall, floor } = await searchParams;
  const floorText = first(floor);
  return { hallId: first(hall), floor: floorText && /^\d+$/.test(floorText) ? Number(floorText) : null };
}

export async function generateMetadata({ searchParams }: LocationPageProps): Promise<Metadata> {
  const { hallId, floor } = await readParams(searchParams);
  const hall = findHall(hallId);
  if (!hall) {
    return { title: "세탁실 위치 · WashOn" };
  }
  const laundry = findLaundry(hall, floor);
  return { title: laundry ? `${hall.name} ${laundry.floor}층 세탁실 · WashOn` : `${hall.name} 구성도 · WashOn` };
}

/** /location[?hall={hallId}[&floor={n}]] — campus 3D map → hall floors → floor plan. */
export default async function LocationPage({ searchParams }: LocationPageProps) {
  const { hallId, floor } = await readParams(searchParams);
  return <LocationView hallId={hallId} floor={floor} />;
}
