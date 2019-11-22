CREATE TABLE `counties` (
  `countyId` INT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`countyId`)
);

CREATE TABLE `localities` (
  `localityId` INT,
  `countyId` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`localityId`),
  FOREIGN KEY (`countyId`) REFERENCES `counties`(`countryId`)
);

CREATE TABLE `streets` (
  `streetId` INT,
  `localityId` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`streetId`),
  FOREIGN KEY (`localityId`) REFERENCES `localities`(`localityId`)
);

CREATE TABLE `streetNumbers` (
  `streetNumberId` INT,
  `streetId` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`streetNumberId`),
  FOREIGN KEY (`streetId`) REFERENCES `streets`(`streetId`)
);

CREATE TABLE `postalCodes` (
  `postalCodeId` INT,
  `postalCode` INT NOT NULL,
  `countyId` INT NOT NULL,
  `localityId` INT NOT NULL,
  `streetId` INT,
  `streetNumberId` INT,
  PRIMARY KEY (`postalCodeId`),
  FOREIGN KEY (`countyId`) REFERENCES `counties`(`countyId`),
  FOREIGN KEY (`localityId`) REFERENCES `localities`(`localityId`),
  FOREIGN KEY (`streetId`) REFERENCES `streets`(`streetId`),
  FOREIGN KEY (`streetNumberId`) REFERENCES `streetNumbers`(`streetNumberId`)
);