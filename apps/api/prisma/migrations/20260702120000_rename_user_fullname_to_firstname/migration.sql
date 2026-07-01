-- Rename legacy User.fullName column to firstName (lastName already exists)
ALTER TABLE "User" RENAME COLUMN "fullName" TO "firstName";
