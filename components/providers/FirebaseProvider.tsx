"use client";

import { useEffect, ReactNode } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAppStore } from "@/lib/store";
import { DensityLevel } from "@/types";
import { WANKHEDE_CONFIG } from "@/lib/venue-configs/wankhede";
import { computeZoneDensity } from "@/lib/density-engine";

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const { setAllDensities } = useAppStore();

  useEffect(() => {
    if (!db) {
      // Fallback if no firebase config - just put mock base density
      const mockDensities: Record<string, DensityLevel> = {
        "S1": "high",
        "S2": "medium",
        "S3": "low",
        "S4": "medium",
        "gate-A": "high",
        "gate-B": "medium",
        "gate-C": "low",
        "gate-D": "medium",
      };
      setAllDensities(mockDensities);
      return;
    }

    const densityRef = ref(db, `density/${WANKHEDE_CONFIG.id}`);
    
    const unsubscribe = onValue(densityRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const newDensities: Record<string, DensityLevel> = {};

      // Parse reports to densities
      Object.keys(data).forEach(zoneId => {
        const zoneData = data[zoneId];
        if (zoneData.reports) {
          const reportsArray = Object.values(zoneData.reports) as any[];
          newDensities[zoneId] = computeZoneDensity(reportsArray, zoneId);
        } else if (zoneData.computedLevel) {
          newDensities[zoneId] = zoneData.computedLevel as DensityLevel;
        }
      });

      setAllDensities(newDensities);
    }, (error) => {
      console.error("Firebase DB error:", error);
    });

    return () => unsubscribe();
  }, [setAllDensities]);

  return <>{children}</>;
}
