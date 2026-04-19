"use client";

import { useEffect, PropsWithChildren } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAppStore } from "@/lib/store";
import { DensityLevel, GateReport } from "@/types";
import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";
import { computeZoneDensity } from "@/lib/density-engine";
import { logger } from "@/lib/logger";

/** Firebase zone data shape from the Realtime Database */
interface ZoneSnapshot {
  reports?: Record<string, GateReport>;
  computedLevel?: DensityLevel;
}

/**
 * Subscribes to Firebase Realtime Database for live density updates.
 * Falls back to mock density data if Firebase is not configured.
 */
export function FirebaseProvider({ children }: PropsWithChildren) {
  const { setAllDensities } = useAppStore();

  useEffect(() => {
    if (!db) {
      const mockDensities: Record<string, DensityLevel> = {
        S1: "high",
        S2: "medium",
        S3: "low",
        S4: "medium",
        "gate-A": "high",
        "gate-B": "medium",
        "gate-C": "low",
        "gate-D": "medium",
      };
      setAllDensities(mockDensities);
      return;
    }

    const densityRef = ref(db, `density/${WANKHEDE_CONFIG.id}`);

    const unsubscribe = onValue(
      densityRef,
      (snapshot) => {
        const data = snapshot.val() as Record<string, ZoneSnapshot> | null;
        if (!data) return;

        const newDensities: Record<string, DensityLevel> = {};

        Object.keys(data).forEach((zoneId) => {
          const zoneData = data[zoneId];
          if (zoneData.reports) {
            const reportsArray: GateReport[] = Object.values(zoneData.reports);
            newDensities[zoneId] = computeZoneDensity(reportsArray, zoneId);
          } else if (zoneData.computedLevel) {
            newDensities[zoneId] = zoneData.computedLevel;
          }
        });

        setAllDensities(newDensities);
      },
      (error) => {
        logger.error("Firebase DB subscription error", error);
      }
    );

    return () => unsubscribe();
  }, [setAllDensities]);

  return <>{children}</>;
}
