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