CREATE TABLE `counties` (
  `countyId` INT,
  `name` VARCHAR(45),
  PRIMARY KEY (`countyId`)
);

CREATE TABLE `localities` (
  `localityId` INT,
  `countyId` INT,
  `name` VARCHAR(100),
  PRIMARY KEY (`localityId`)
);

CREATE TABLE `streets` (
  `streetId` INT,
  `localityId` INT,
  `name` VARCHAR(100),
  PRIMARY KEY (`streetId`)
);

CREATE TABLE `streetNumbers` (
  `streetNumberId` INT,
  `streetId` INT,
  `name` VARCHAR(100),
  PRIMARY KEY (`streetNumberId`)
);

CREATE TABLE `postalCodes` (
  `postalCodeId` INT,
  `postalCode` INT,
  `countyId` INT,
  `localityId` INT,
  `streetId` INT,
  `streetNumberId` INT,
  PRIMARY KEY (`postalCodeId`)
);