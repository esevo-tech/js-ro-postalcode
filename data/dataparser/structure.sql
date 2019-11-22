CREATE TABLE `counties` (
  `countyId` INT,
  `name` VARCHAR(45),
  PRIMARY KEY (`countyId`)
);

CREATE TABLE `localities` (
  `localityId` INT,
  `countyId` INT,
  `name` VARCHAR(100),
  PRIMARY KEY (`localityId`),
  FOREIGN KEY (`countyId`) REFERENCES `counties`(`countryId`)
);

CREATE TABLE `streets` (
  `streetId` INT,
  `localityId` INT,
  `name` VARCHAR(100),
  PRIMARY KEY (`streetId`),
  FOREIGN KEY (`localityId`) REFERENCES `localities`(`localityId`)
);

CREATE TABLE `streetNumbers` (
  `streetNumberId` INT,
  `streetId` INT,
  `name` VARCHAR(100),
  PRIMARY KEY (`streetNumberId`),
  FOREIGN KEY (`streetId`) REFERENCES `streets`(`streetId`)
);

CREATE TABLE `postalCodes` (
  `postalCodeId` INT,
  `postalCode` INT,
  `countyId` INT,
  `localityId` INT,
  `streetId` INT,
  `streetNumberId` INT,
  PRIMARY KEY (`postalCodeId`),
  FOREIGN KEY (`countyId`) REFERENCES `counties`(`countyId`),
  FOREIGN KEY (`localityId`) REFERENCES `localities`(`localityId`),
  FOREIGN KEY (`streetId`) REFERENCES `streets`(`streetId`),
  FOREIGN KEY (`streetNumberId`) REFERENCES `streetNumbers`(`streetNumberId`)
);