import { useEffect, useRef, useState } from "react";
import Button from "../general/Button";
import type Track from "../../interfaces/Track";

interface Props {
  track: Track;
}

export default function ButtonCopyTrack({ track }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopyLink = async () => {
    const fullLink = `${window.location.origin}/track/${track.id}`; 

    try {
      await navigator.clipboard.writeText(fullLink);

      setCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Ne mogu kopirati link:", err);
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleCopyLink}
      disabled={copied}     
    >
      <i className={`fa ${copied ? "fa-check" : "fa-copy"}`} />
      <span>{copied ? "Kopirano" : "Kopiraj link"}</span>
    </Button>
  );
}
