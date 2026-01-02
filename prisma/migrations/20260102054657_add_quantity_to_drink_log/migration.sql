-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DrinkLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "drinkId" TEXT NOT NULL,
    "bartenderId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "userId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "DrinkLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DrinkLog_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "Drink" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DrinkLog_bartenderId_fkey" FOREIGN KEY ("bartenderId") REFERENCES "Bartender" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DrinkLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DrinkLog" ("bartenderId", "customerName", "drinkId", "eventId", "id", "status", "timestamp", "userId") SELECT "bartenderId", "customerName", "drinkId", "eventId", "id", "status", "timestamp", "userId" FROM "DrinkLog";
DROP TABLE "DrinkLog";
ALTER TABLE "new_DrinkLog" RENAME TO "DrinkLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
