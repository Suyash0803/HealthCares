// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {HealthRecordFactory} from "../src/HealthRecordContractFactory.sol";
import {HealthRecordContract} from "../src/HealthRecordContract.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

/**
 * @title Interactions
 * @notice Handles all interactions with deployed contracts
 */
contract Interactions is Script {
    /* Factory Interactions */

    function getFactory() public view returns (HealthRecordFactory) {
        address factoryAddress = DevOpsTools.get_most_recent_deployment("HealthRecordFactory", block.chainid);
        return HealthRecordFactory(factoryAddress);
    }

    function createPatient(
        string memory name,
        uint256 id,
        uint256 age,
        string memory gender,
        uint256 height,
        uint256 weight,
        string memory bloodGroup
    ) public returns (address) {
        HealthRecordFactory factory = getFactory();

        vm.startBroadcast();
        address patientContract = factory.createHealthRecord(name, id, age, gender, height, weight, bloodGroup);
        vm.stopBroadcast();

        return patientContract;
    }

    function getPatientContract(uint256 patientId) public view returns (HealthRecordContract) {
        HealthRecordFactory factory = getFactory();
        address contractAddress = factory.getContractByPatientId(patientId);
        return HealthRecordContract(contractAddress);
    }

    function getAllPatients() public view returns (uint256[] memory) {
        HealthRecordFactory factory = getFactory();
        return factory.getAllPatientIds();
    }

    /* Patient Record Interactions */

    function addPrescription(address healthRecordAddress, string memory prescriptionName, string memory dataHash)
        public
    {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        healthRecord.addPrescription(prescriptionName, dataHash);
        vm.stopBroadcast();
    }

    function addReport(address healthRecordAddress, string memory reportName, string memory dataHash) public {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        healthRecord.addReport(reportName, dataHash);
        vm.stopBroadcast();
    }

    function addBill(address healthRecordAddress, string memory billName, string memory dataHash) public {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        healthRecord.addBill(billName, dataHash);
        vm.stopBroadcast();
    }

    function updatePatientInfo(
        address healthRecordAddress,
        string memory name,
        uint256 age,
        string memory gender,
        uint256 height,
        uint256 weight,
        string memory bloodGroup
    ) public {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        if (bytes(name).length > 0) {
            healthRecord.updatePatientName(name);
        }
        if (age > 0) {
            healthRecord.updatePatientAge(age);
        }
        if (bytes(gender).length > 0) {
            healthRecord.updatePatientGender(gender);
        }
        if (height > 0) {
            healthRecord.updatePatientHeight(height);
        }
        if (weight > 0) {
            healthRecord.updatePatientWeight(weight);
        }
        if (bytes(bloodGroup).length > 0) {
            healthRecord.updatePatientBloodGroup(bloodGroup);
        }
        vm.stopBroadcast();
    }

    /* Access Control Interactions */

    function requestAccess(address healthRecordAddress) public {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        healthRecord.requestAccess();
        vm.stopBroadcast();
    }

    function approveAccess(
        address healthRecordAddress,
        address requesterAddress,
        uint256 expiryDuration,
        uint256[] memory prescriptionIds,
        uint256[] memory reportIds,
        uint256[] memory billIds
    ) public {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        healthRecord.approveAccess(requesterAddress, expiryDuration, prescriptionIds, reportIds, billIds);
        vm.stopBroadcast();
    }

    function revokeAccess(address healthRecordAddress, address requesterAddress) public {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        healthRecord.revokeAccess(requesterAddress);
        vm.stopBroadcast();
    }

    function requestExtendAccess(address healthRecordAddress, uint256 additionalTime) public {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        healthRecord.requestExtendAccess(additionalTime);
        vm.stopBroadcast();
    }

    function approveExtendAccess(address healthRecordAddress, address requesterAddress) public {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);

        vm.startBroadcast();
        healthRecord.approveExtendAccess(requesterAddress);
        vm.stopBroadcast();
    }

    /* View Functions */

    function getPatientDetails(address healthRecordAddress)
        public
        view
        returns (
            string memory name,
            uint256 age,
            string memory gender,
            uint256 height,
            uint256 weight,
            string memory bloodGroup
        )
    {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);
        return healthRecord.getPatientDetails();
    }

    function getApprovedRecords(address healthRecordAddress)
        public
        view
        returns (
            HealthRecordContract.Prescription[] memory,
            HealthRecordContract.Report[] memory,
            HealthRecordContract.Bill[] memory
        )
    {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);
        return healthRecord.getApprovedRecords();
    }

    function hasAccessExpired(address healthRecordAddress) public view returns (bool) {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);
        return healthRecord.hasAccessExpired();
    }

    function checkExtensionRequest(address healthRecordAddress, address requesterAddress)
        public
        view
        returns (bool exists, uint256 additionalTime, uint256 requestTime)
    {
        HealthRecordContract healthRecord = HealthRecordContract(healthRecordAddress);
        return healthRecord.checkExtensionRequest(requesterAddress);
    }
}
