// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {HealthRecordContract} from "./HealthRecordContract.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HealthRecordFactory
 * @author Kshitij Dhamanikar
 * @notice Factory contract to deploy and manage HealthRecordContract instances
 * @dev Creates and tracks patient health record contracts
 */
contract HealthRecordFactory is Ownable {
    /* errors */
    error HealthRecordFactory__PatientIdAlreadyExists();
    error HealthRecordFactory__PatientContractNotFound();

    /* State variables */
    mapping(uint256 patientId => address contractAddress) private patientIdToContract;
    mapping(address patient => uint256 patientId) private patientToId;

    uint256[] private allPatientIds;

    /* Events */
    event HealthRecordCreated(
        uint256 indexed patientId, address indexed patientAddress, address indexed contractAddress
    );

    constructor() Ownable(msg.sender) {}
    /**
     * @notice Creates a new health record contract for a patient
     * @dev Deploys a new HealthRecordContract and transfers ownership to the patient
     * @param name Patient's full name
     * @param id Unique identifier for the patient
     * @param age Patient's age in years
     * @param gender Patient's gender
     * @param height Patient's height in centimeters
     * @param weight Patient's weight in kilograms
     * @param bloodGroup Patient's blood group
     * @return Address of the newly created contract
     */

    function createHealthRecord(
        string memory name,
        uint256 id,
        uint256 age,
        string memory gender,
        uint256 height,
        uint256 weight,
        string memory bloodGroup
    ) external returns (address) {
        if (patientIdToContract[id] != address(0)) {
            revert HealthRecordFactory__PatientIdAlreadyExists();
        }

        HealthRecordContract newContract = new HealthRecordContract(name, id, age, gender, height, weight, bloodGroup);

        // Transfer ownership to the patient (caller)
        newContract.transferOwnership(msg.sender);

        // Record the contract in our mappings
        patientIdToContract[id] = address(newContract);
        patientToId[msg.sender] = id;
        allPatientIds.push(id);

        emit HealthRecordCreated(id, msg.sender, address(newContract));
        return address(newContract);
    }

    /**
     * @notice Get the contract address for a specific patient ID
     * @param patientId The patient's unique identifier
     * @return The address of the patient's health record contract
     */
    function getContractByPatientId(uint256 patientId) external view returns (address) {
        address contractAddress = patientIdToContract[patientId];
        if (contractAddress == address(0)) {
            revert HealthRecordFactory__PatientContractNotFound();
        }
        return contractAddress;
    }

    /**
     * @notice Get the patient ID associated with a patient address
     * @param patient The patient's address
     * @return The patient's unique identifier
     */
    function getPatientIdByAddress(address patient) external view returns (uint256) {
        uint256 id = patientToId[patient];
        if (patientIdToContract[id] == address(0)) {
            revert HealthRecordFactory__PatientContractNotFound();
        }
        return id;
    }

    /**
     * @notice Get all patient IDs registered in the system
     * @return Array of all patient IDs
     */
    function getAllPatientIds() external view returns (uint256[] memory) {
        return allPatientIds;
    }

    /**
     * @notice Get the total number of patients in the system
     * @return Total number of patients
     */
    function getPatientCount() external view returns (uint256) {
        return allPatientIds.length;
    }
}
