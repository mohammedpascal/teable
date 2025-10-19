-- CreateTable
CREATE TABLE "dashboard_widget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dashboard_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" TEXT,
    "position" TEXT,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "last_modified_time" DATETIME,
    "last_modified_by" TEXT,
    CONSTRAINT "dashboard_widget_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dashboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
