"use client";

import { useEffect, useState } from "react";
import { createClient } from "./client";

export default function LiveVisitors() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    // Create a unique ID for this browser session
    const visitorId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const channel = supabase.channel("sfh-live-visitors", {
      config: {
        presence: {
          key: visitorId,
        },
      },
    });

    const updateVisitorCount = () => {
      const state = channel.presenceState();
      const uniqueVisitors = Object.keys(state).length;

      setVisitorCount(uniqueVisitors);
    };

    channel
      .on("presence", { event: "sync" }, updateVisitorCount)
      .on("presence", { event: "join" }, updateVisitorCount)
      .on("presence", { event: "leave" }, updateVisitorCount)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online: true,
            joinedAt: new Date().toISOString(),
          });

          updateVisitorCount();
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, []);

  // Don't show anything until at least one visitor is connected
  if (visitorCount < 1) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#e6d6b8] bg-[#fbf8f1] px-4 py-2 text-sm text-[#4a4a4a] shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c58a2a] opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c58a2a]" />
      </span>

      <span>
        <strong className="font-semibold text-[#1d1d1f]">
          {visitorCount}
        </strong>{" "}
        {visitorCount === 1 ? "fragrance lover" : "fragrance lovers"}{" "}
        are exploring SFH
      </span>
    </div>
  );
}