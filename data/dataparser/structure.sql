CREATE TABLE `counties` (
  `countyId` INT,
  `name` VARCHAR(45)
);

CREATE TABLE `localities` (
  `localityId` INT,
  `countyId` INT,
  `name` VARCHAR(100),
  `postalCode` VARCHAR(100)
);

CREATE TABLE `streets` (
  `streetId` INT,
  `localityId` INT,
  `name` VARCHAR(100),
  `postalCode` VARCHAR(100)
);