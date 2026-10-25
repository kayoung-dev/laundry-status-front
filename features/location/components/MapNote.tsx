import styles from "./MapNote.module.css";

interface MapNoteProps {
  children: string;
  /** "above" sits on top of the point (building names), "center" on it (rooms). */
  place?: "above" | "center";
}

/** Small read-only label on the 3D map: other buildings, rooms on the top floor. */
export default function MapNote({ children, place = "above" }: MapNoteProps) {
  return (
    <span className={styles.note} data-place={place}>
      {children}
    </span>
  );
}
