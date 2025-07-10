// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HealthRecordContract
 * @author Kshitij Dhamanikar
 * @notice Manages personal health records on-chain with selective access control
 * @dev Stores patient information and medical record metadata with IPFS hash references
 */
contract HealthRecordContract is Ownable {
    /* errors */
    error HealthRecordContract__InvalidBill();
    error HealthRecordContract__InvalidPrescription();
    error HealthRecordContract__InvalidReport();
    error HealthRecordContract__NoRequestFound();
    error HealthRecordContract__RequesterNotAuthorized();
    error HealthRecordContract__AccessNotApproved();
    error HealthRecordContract__InvalidRecordType();
    error HealthRecordContract__AccessExpired();
    error HealthRecordContract__NoExtensionRequestFound();

    /* interfaces, libraries, contract */

    /* Type declarations */
    /**
     * @notice Patient personal information
     * @param name Patient's full name
     * @param age Patient's age in years
     * @param gender Patient's gender
     * @param height Patient's height in centimeters
     * @param weight Patient's weight in kilograms
     * @param bloodGroup Patient's blood group
     */
    struct Patient {
        string name;
        uint256 age;
        string gender;
        uint256 height;
        uint256 weight;
        string bloodGroup;
    }

    /**
     * @notice Medical prescription information
     * @param prescriptionName Unique identifier for the prescription (name-date format)
     * @param prescriptionDataHash IPFS hash of the encrypted prescription data
     */
    struct Prescription {
        string prescriptionName; // format parsed from the frontend name-date, eg stomachpainprescription-110225
        string prescriptionDataHash; // hash of the prescription data stored on IPFS
    }

    /**
     * @notice Medical bill information
     * @param billName Unique identifier for the bill (name-date format)
     * @param billDataHash IPFS hash of the encrypted bill data
     */
    struct Bill {
        string billName; // format parsed from the frontend name-date, eg doctorvisitbill-110225
        string billDataHash; // hash of the bill data stored on IPFS
    }

    /**
     * @notice Medical report information
     * @param reportName Unique identifier for the report (name-date format)
     * @param reportDataHash IPFS hash of the encrypted report data
     */
    struct Report {
        string reportName; // format parsed from the frontend name-date, eg xrayreport-110225
        string reportDataHash; // hash of the report data stored on IPFS
    }

    /**
     * @notice Request for access to patient records
     * @param requester Address of the entity requesting access
     * @param requestTime Timestamp when the request was made
     * @param approved Whether the request has been approved by the patient
     * @param expiryTime Timestamp when the access expires
     * @param prescriptionIds Array of approved prescription IDs
     * @param reportIds Array of approved report IDs
     * @param billIds Array of approved bill IDs
     */
    struct AccessRequest {
        address requester;
        uint256 requestTime;
        bool approved;
        uint256 expiryTime;
        uint256[] prescriptionIds;
        uint256[] reportIds;
        uint256[] billIds;
    }

    /**
     * @notice Request for extending access to patient records
     * @param requester Address of the entity requesting extension
     * @param requestTime Timestamp when the request was made
     * @param additionalTime Additional time requested in seconds
     * @param processed Whether the request has been processed
     */
    struct ExtensionRequest {
        address requester;
        uint256 requestTime;
        uint256 additionalTime;
        bool processed;
    }

    /* State variables */
    Patient private patient;
    uint256 private immutable i_PatientId;

    Prescription[] private prescriptions;
    Bill[] private bills;
    Report[] private reports;

    mapping(string prescriptionName => uint256 prescriptionId) private prescriptionNameToPrescriptionId;
    mapping(string billName => uint256 billId) private billNameToBillId;
    mapping(string reportName => uint256 reportId) private reportNameToReportId;

    mapping(address => AccessRequest) private accessRequests;
    mapping(address => bool) private authorizedRequesters;
    mapping(address => ExtensionRequest) private extensionRequests;

    /* Events */
    event PatientInformationStored(uint256 indexed patientId);

    event PatientNameUpdated(uint256 indexed patientId, string indexed newName);
    event PatientAgeUpdated(uint256 indexed patientId, uint256 indexed newAge);
    event PatientGenderUpdated(uint256 indexed patientId, string indexed newGender);
    event PatientHeightUpdated(uint256 indexed patientId, uint256 indexed newHeight);
    event PatientWeightUpdated(uint256 indexed patientId, uint256 indexed newWeight);
    event PatientBloodGroupUpdated(uint256 indexed patientId, string indexed newBloodGroup);

    event PrescriptionAdded(uint256 indexed patientId, string indexed prescriptionName, uint256 prescriptionId);
    event BillAdded(uint256 indexed patientId, string indexed billName, uint256 billId);
    event ReportAdded(uint256 indexed patientId, string indexed reportName, uint256 reportId);

    event AccessRequested(address indexed requester, uint256 timestamp);
    event AccessApproved(address indexed requester, uint256 timestamp);
    event AccessRevoked(address indexed requester, uint256 timestamp);
    event AccessExtended(address indexed requester, uint256 newExpiryTime);

    event ExtensionRequested(address indexed requester, uint256 additionalTime, uint256 timestamp);
    event ExtensionApproved(address indexed requester, uint256 newExpiryTime);

    /* Modifiers */
    /**
     * @notice Ensures the address has been authorized to access records
     * @param requester Address to check authorization for
     */
    modifier onlyAuthorized(address requester) {
        if (!authorizedRequesters[requester]) {
            revert HealthRecordContract__RequesterNotAuthorized();
        }
        _;
    }

    /**
     * @notice Ensures a request exists from the given address
     * @param requester Address to check for existing request
     */
    modifier requestExists(address requester) {
        if (accessRequests[requester].requester != requester) {
            revert HealthRecordContract__NoRequestFound();
        }
        _;
    }

    /**
     * @notice Ensures the requester's access has been approved
     * @param requester Address to check approval status
     */
    modifier accessApproved(address requester) {
        if (!accessRequests[requester].approved) {
            revert HealthRecordContract__AccessNotApproved();
        }
        _;
    }

    /**
     * @notice Ensures the requester's access has not expired
     * @param requester Address to check expiry status
     */
    modifier notExpired(address requester) {
        if (accessRequests[requester].expiryTime != 0 && block.timestamp > accessRequests[requester].expiryTime) {
            revert HealthRecordContract__AccessExpired();
        }
        _;
    }

    /* constructor */
    /**
     * @notice Creates a new health record contract for a patient
     * @dev Sets the caller as the owner of the contract
     * @param _name Patient's full name
     * @param _id Unique identifier for the patient
     * @param _age Patient's age in years
     * @param _gender Patient's gender
     * @param _height Patient's height in centimeters
     * @param _weight Patient's weight in kilograms
     * @param _bloodGroup Patient's blood group
     */
    constructor(
        string memory _name,
        uint256 _id,
        uint256 _age,
        string memory _gender,
        uint256 _height,
        uint256 _weight,
        string memory _bloodGroup
    ) Ownable(msg.sender) {
        i_PatientId = _id;
        patient = Patient(_name, _age, _gender, _height, _weight, _bloodGroup);
        emit PatientInformationStored(i_PatientId);
    }

    /* external */
    /**
     * @notice Updates the patient's name
     * @dev Only callable by the contract owner (patient)
     * @param updatedName New name to set
     */
    function updatePatientName(string memory updatedName) external onlyOwner {
        patient.name = updatedName;
        emit PatientNameUpdated(i_PatientId, updatedName);
    }

    /**
     * @notice Updates the patient's age
     * @dev Only callable by the contract owner (patient)
     * @param updatedAge New age to set
     */
    function updatePatientAge(uint256 updatedAge) external onlyOwner {
        patient.age = updatedAge;
        emit PatientAgeUpdated(i_PatientId, updatedAge);
    }

    /**
     * @notice Updates the patient's gender
     * @dev Only callable by the contract owner (patient)
     * @param updatedGender New gender to set
     */
    function updatePatientGender(string memory updatedGender) external onlyOwner {
        patient.gender = updatedGender;
        emit PatientGenderUpdated(i_PatientId, updatedGender);
    }

    /**
     * @notice Updates the patient's height
     * @dev Only callable by the contract owner (patient)
     * @param updatedHeight New height to set in centimeters
     */
    function updatePatientHeight(uint256 updatedHeight) external onlyOwner {
        patient.height = updatedHeight;
        emit PatientHeightUpdated(i_PatientId, updatedHeight);
    }

    /**
     * @notice Updates the patient's weight
     * @dev Only callable by the contract owner (patient)
     * @param updatedWeight New weight to set in kilograms
     */
    function updatePatientWeight(uint256 updatedWeight) external onlyOwner {
        patient.weight = updatedWeight;
        emit PatientWeightUpdated(i_PatientId, updatedWeight);
    }

    /**
     * @notice Updates the patient's blood group
     * @dev Only callable by the contract owner (patient)
     * @param updatedBloodGroup New blood group to set
     */
    function updatePatientBloodGroup(string memory updatedBloodGroup) external onlyOwner {
        patient.bloodGroup = updatedBloodGroup;
        emit PatientBloodGroupUpdated(i_PatientId, updatedBloodGroup);
    }

    /**
     * @notice Adds a new prescription record
     * @dev Only callable by the contract owner (patient)
     * @param prescriptionName Unique identifier for the prescription
     * @param dataHash IPFS hash of the encrypted prescription data
     */
    function addPrescription(string memory prescriptionName, string memory dataHash) external onlyOwner {
        prescriptions.push(Prescription(prescriptionName, dataHash));
        uint256 prescriptionId = prescriptions.length - 1;
        prescriptionNameToPrescriptionId[prescriptionName] = prescriptionId;
        emit PrescriptionAdded(i_PatientId, prescriptionName, prescriptionId);
    }

    /**
     * @notice Adds a new bill record
     * @dev Only callable by the contract owner (patient)
     * @param billName Unique identifier for the bill
     * @param dataHash IPFS hash of the encrypted bill data
     */
    function addBill(string memory billName, string memory dataHash) external onlyOwner {
        bills.push(Bill(billName, dataHash));
        uint256 billId = bills.length - 1;
        billNameToBillId[billName] = billId;
        emit BillAdded(i_PatientId, billName, billId);
    }

    /**
     * @notice Adds a new medical report record
     * @dev Only callable by the contract owner (patient)
     * @param reportName Unique identifier for the report
     * @param dataHash IPFS hash of the encrypted report data
     */
    function addReport(string memory reportName, string memory dataHash) external onlyOwner {
        reports.push(Report(reportName, dataHash));
        uint256 reportId = reports.length - 1;
        reportNameToReportId[reportName] = reportId;
        emit ReportAdded(i_PatientId, reportName, reportId);
    }

    /**
     * @notice Request access to patient records
     * @dev Creates an access request for the caller
     */
    function requestAccess() external {
        accessRequests[msg.sender] = AccessRequest({
            requester: msg.sender,
            requestTime: block.timestamp,
            approved: false,
            expiryTime: 0,
            prescriptionIds: new uint256[](0),
            reportIds: new uint256[](0),
            billIds: new uint256[](0)
        });

        emit AccessRequested(msg.sender, block.timestamp);
    }

    /**
     * @notice Approve access to specific records for a requester
     * @dev Only callable by the contract owner (patient)
     * @param requester Address of the entity requesting access
     * @param expiryDuration Duration in seconds from now for access to expire
     * @param _prescriptionIds Array of prescription IDs to approve
     * @param _reportIds Array of report IDs to approve
     * @param _billIds Array of bill IDs to approve
     */
    function approveAccess(
        address requester,
        uint256 expiryDuration,
        uint256[] calldata _prescriptionIds,
        uint256[] calldata _reportIds,
        uint256[] calldata _billIds
    ) external onlyOwner requestExists(requester) {
        AccessRequest storage request = accessRequests[requester];
        request.approved = true;

        if (expiryDuration > 0) {
            request.expiryTime = block.timestamp + expiryDuration;
        } else {
            request.expiryTime = 0; // if expiryDuration is 0, the access will not expire
        }

        request.prescriptionIds = _prescriptionIds;
        request.reportIds = _reportIds;
        request.billIds = _billIds;

        authorizedRequesters[requester] = true;

        emit AccessApproved(requester, block.timestamp);
    }

    /**
     * @notice Revoke access for a previously authorized requester
     * @dev Only callable by the contract owner (patient)
     * @param requester Address of the entity to revoke access from
     */
    function revokeAccess(address requester) external onlyOwner onlyAuthorized(requester) {
        delete accessRequests[requester];
        authorizedRequesters[requester] = false;

        emit AccessRevoked(requester, block.timestamp);
    }

    /**
     * @notice Request an extension to access period
     * @dev Creates an extension request for the caller
     * @param additionalTime Additional time in seconds requested
     */
    function requestExtendAccess(uint256 additionalTime)
        external
        onlyAuthorized(msg.sender)
        accessApproved(msg.sender)
    {
        extensionRequests[msg.sender] = ExtensionRequest({
            requester: msg.sender,
            requestTime: block.timestamp,
            additionalTime: additionalTime,
            processed: false
        });

        emit ExtensionRequested(msg.sender, additionalTime, block.timestamp);
    }

    /**
     * @notice Approve an extension request
     * @dev Only callable by the contract owner (patient)
     * @param requester Address of the entity requesting extension
     */
    function approveExtendAccess(address requester) external onlyOwner onlyAuthorized(requester) {
        ExtensionRequest storage extensionRequest = extensionRequests[requester];

        if (extensionRequest.requester != requester || extensionRequest.processed) {
            revert HealthRecordContract__NoExtensionRequestFound();
        }

        AccessRequest storage accessRequest = accessRequests[requester];

        if (accessRequest.expiryTime == 0) {
            accessRequest.expiryTime = block.timestamp + extensionRequest.additionalTime;
        } else {
            accessRequest.expiryTime += extensionRequest.additionalTime;
        }

        extensionRequest.processed = true;

        emit ExtensionApproved(requester, accessRequest.expiryTime);
    }

    /* public */
    /* internal */
    /* private */
    /* internal & private view & pure functions */

    /* external & public view & pure functions */
    /**
     * @notice Get all approved records for the caller
     * @dev Only callable by an authorized and approved requester
     * @return approvedPrescriptions Array of approved prescription records
     * @return approvedReports Array of approved report records
     * @return approvedBills Array of approved bill records
     */
    function getApprovedRecords()
        external
        view
        onlyAuthorized(msg.sender)
        accessApproved(msg.sender)
        notExpired(msg.sender)
        returns (
            Prescription[] memory approvedPrescriptions,
            Report[] memory approvedReports,
            Bill[] memory approvedBills
        )
    {
        AccessRequest memory request = accessRequests[msg.sender];

        approvedPrescriptions = new Prescription[](request.prescriptionIds.length);
        approvedReports = new Report[](request.reportIds.length);
        approvedBills = new Bill[](request.billIds.length);

        for (uint256 i = 0; i < request.prescriptionIds.length; i++) {
            uint256 id = request.prescriptionIds[i];
            approvedPrescriptions[i] = prescriptions[id];
        }

        for (uint256 i = 0; i < request.reportIds.length; i++) {
            uint256 id = request.reportIds[i];
            approvedReports[i] = reports[id];
        }

        for (uint256 i = 0; i < request.billIds.length; i++) {
            uint256 id = request.billIds[i];
            approvedBills[i] = bills[id];
        }

        return (approvedPrescriptions, approvedReports, approvedBills);
    }

    /**
     * @notice Get patient's personal details
     * @dev Only callable by the contract owner (patient)
     * @return name Patient's name
     * @return age Patient's age
     * @return gender Patient's gender
     * @return height Patient's height
     * @return weight Patient's weight
     * @return bloodGroup Patient's blood group
     */
    function getPatientDetails()
        external
        view
        onlyOwner
        returns (
            string memory name,
            uint256 age,
            string memory gender,
            uint256 height,
            uint256 weight,
            string memory bloodGroup
        )
    {
        return (patient.name, patient.age, patient.gender, patient.height, patient.weight, patient.bloodGroup);
    }

    /**
     * @notice Get a specific bill by name
     * @dev Only callable by the contract owner (patient)
     * @param _billName Name of the bill to retrieve
     * @return Bill record
     */
    function getBill(string memory _billName) external view onlyOwner returns (Bill memory) {
        uint256 billIndex = billNameToBillId[_billName];
        if (bills.length == 0 || (keccak256(bytes(_billName)) != keccak256(bytes(bills[billIndex].billName)))) {
            revert HealthRecordContract__InvalidBill();
        }
        return bills[billIndex];
    }

    /**
     * @notice Get a specific prescription by name
     * @dev Only callable by the contract owner (patient)
     * @param _prescriptionName Name of the prescription to retrieve
     * @return Prescription record
     */
    function getPrescription(string memory _prescriptionName) external view onlyOwner returns (Prescription memory) {
        uint256 prescriptionIndex = prescriptionNameToPrescriptionId[_prescriptionName];
        if (
            prescriptions.length == 0
                || (
                    keccak256(bytes(_prescriptionName))
                        != keccak256(bytes(prescriptions[prescriptionIndex].prescriptionName))
                )
        ) {
            revert HealthRecordContract__InvalidPrescription();
        }
        return prescriptions[prescriptionIndex];
    }

    /**
     * @notice Get a specific report by name
     * @dev Only callable by the contract owner (patient)
     * @param _reportName Name of the report to retrieve
     * @return Report record
     */
    function getReport(string memory _reportName) external view onlyOwner returns (Report memory) {
        uint256 reportIndex = reportNameToReportId[_reportName];
        if (reports.length == 0 || (keccak256(bytes(_reportName)) != keccak256(bytes(reports[reportIndex].reportName))))
        {
            revert HealthRecordContract__InvalidReport();
        }
        return reports[reportIndex];
    }

    /**
     * @notice Get the patient's unique identifier
     * @return Patient ID
     */
    function getPatientId() external view returns (uint256) {
        return i_PatientId;
    }

    /**
     * @notice Check if access has expired
     * @dev Only callable by an authorized and approved requester
     * @return True if access has expired, false otherwise
     */
    function hasAccessExpired() external view returns (bool) {
        if (!authorizedRequesters[msg.sender]) {
            return true;
        }

        AccessRequest memory request = accessRequests[msg.sender];
        if (!request.approved) {
            return true;
        }

        if (request.expiryTime == 0) {
            return false;
        }

        return block.timestamp > request.expiryTime;
    }

    /**
     * @notice Check if an extension request exists for a requester
     * @dev Only callable by the contract owner
     * @param requester Address to check for extension request
     * @return exists Whether an unprocessed extension request exists
     * @return additionalTime The additional time requested (if exists)
     * @return requestTime When the request was made (if exists)
     */
    function checkExtensionRequest(address requester)
        external
        view
        onlyOwner
        returns (bool exists, uint256 additionalTime, uint256 requestTime)
    {
        ExtensionRequest memory request = extensionRequests[requester];
        if (request.requester == requester && !request.processed) {
            return (true, request.additionalTime, request.requestTime);
        }
        return (false, 0, 0);
    }
}
