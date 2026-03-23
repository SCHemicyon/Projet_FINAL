-- CreateTable
CREATE TABLE `Car` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registration` VARCHAR(191) NOT NULL,
    `transmission` ENUM('MANUELLE', 'AUTOMATIQUE') NOT NULL,
    `carModel` VARCHAR(191) NOT NULL,
    `employeeId` INTEGER NULL,
    `entrepriseId` INTEGER NOT NULL,

    UNIQUE INDEX `Car_registration_key`(`registration`),
    UNIQUE INDEX `Car_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lastName` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `mail` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `age` INTEGER NULL,
    `gender` ENUM('HOMME', 'FEMME', 'AUTRE') NULL,
    `entrepriseId` INTEGER NOT NULL,

    UNIQUE INDEX `Employee_mail_key`(`mail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entreprise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raisonSociale` VARCHAR(191) NOT NULL,
    `siret` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `headName` VARCHAR(191) NULL,

    UNIQUE INDEX `Entreprise_siret_key`(`siret`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
