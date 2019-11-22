CREATE TABLE `counties` (
  `countyId` INT,
  `name` VARCHAR(45)
);

CREATE TABLE `localities` (
  `localityId` INT,
  `countyId` INT,
  `name` VARCHAR(100),
  `postalCode` INT
);

CREATE TABLE `streets` (
  `streetId` INT,
  `localityId` INT,
  `name` VARCHAR(100),
  `postalCode` INT
);

CREATE TABLE `streetNumbers` (
  `streetNumberId` INT,
  `streetId` INT,
  `name` VARCHAR(100),
  `postalCode` INT
);

CREATE TABLE `postalCodes` (
  `postalCode` INT,
  `countyId` INT,
  `localityId` INT,
  `streetId` INT,
  `streetNumberId` INT
);