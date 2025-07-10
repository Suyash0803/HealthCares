// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {HealthRecordContract} from "src/HealthRecordContract.sol";

contract TestHealthRecordContract is Test {
    HealthRecordContract healthRecord;

    address owner = address(1);
    address requester1 = address(2);
    address requester2 = address(3);

    // Patient data
    string constant NAME = "John Doe";
    uint256 constant PATIENT_ID = 123456;
    uint256 constant AGE = 30;
    string constant GENDER = "Male";
    uint256 constant HEIGHT = 180; // cm
    uint256 constant WEIGHT = 75; // kg
    string constant BLOOD_GROUP = "O+";

    // Test data
    string constant PRESCRIPTION_NAME = "painkillers-230525";
    string constant PRESCRIPTION_HASH = "QmPrescriptionHash123456";
    string constant REPORT_NAME = "bloodtest-230525";
    string constant REPORT_HASH = "QmReportHash123456";
    string constant BILL_NAME = "consultation-230525";
    string constant BILL_HASH = "QmBillHash123456";

    function setUp() public {
        vm.startPrank(owner);
        healthRecord = new HealthRecordContract(NAME, PATIENT_ID, AGE, GENDER, HEIGHT, WEIGHT, BLOOD_GROUP);
        vm.stopPrank();
    }

    // Test constructor and initial values
    function test_Constructor() public {
        assertEq(healthRecord.getPatientId(), PATIENT_ID);

        vm.startPrank(owner);
        (
            string memory name,
            uint256 age,
            string memory gender,
            uint256 height,
            uint256 weight,
            string memory bloodGroup
        ) = healthRecord.getPatientDetails();
        vm.stopPrank();

        assertEq(name, NAME);
        assertEq(age, AGE);
        assertEq(gender, GENDER);
        assertEq(height, HEIGHT);
        assertEq(weight, WEIGHT);
        assertEq(bloodGroup, BLOOD_GROUP);
    }

    // Test patient information updates
    function test_UpdatePatientName() public {
        string memory newName = "Jane Doe";

        vm.prank(owner);
        healthRecord.updatePatientName(newName);

        vm.prank(owner);
        (string memory name,,,,,) = healthRecord.getPatientDetails();

        assertEq(name, newName);
    }

    function test_UpdatePatientAge() public {
        uint256 newAge = 31;

        vm.prank(owner);
        healthRecord.updatePatientAge(newAge);

        vm.prank(owner);
        (, uint256 age,,,,) = healthRecord.getPatientDetails();

        assertEq(age, newAge);
    }

    function test_UpdatePatientGender() public {
        string memory newGender = "Female";

        vm.prank(owner);
        healthRecord.updatePatientGender(newGender);

        vm.prank(owner);
        (,, string memory gender,,,) = healthRecord.getPatientDetails();

        assertEq(gender, newGender);
    }

    function test_UpdatePatientHeight() public {
        uint256 newHeight = 182;

        vm.prank(owner);
        healthRecord.updatePatientHeight(newHeight);

        vm.prank(owner);
        (,,, uint256 height,,) = healthRecord.getPatientDetails();

        assertEq(height, newHeight);
    }

    function test_UpdatePatientWeight() public {
        uint256 newWeight = 77;

        vm.prank(owner);
        healthRecord.updatePatientWeight(newWeight);

        vm.prank(owner);
        (,,,, uint256 weight,) = healthRecord.getPatientDetails();

        assertEq(weight, newWeight);
    }

    function test_UpdatePatientBloodGroup() public {
        string memory newBloodGroup = "AB-";

        vm.prank(owner);
        healthRecord.updatePatientBloodGroup(newBloodGroup);

        vm.prank(owner);
        (,,,,, string memory bloodGroup) = healthRecord.getPatientDetails();

        assertEq(bloodGroup, newBloodGroup);
    }

    // Test adding medical records
    function test_AddPrescription() public {
        vm.prank(owner);
        healthRecord.addPrescription(PRESCRIPTION_NAME, PRESCRIPTION_HASH);

        vm.prank(owner);
        HealthRecordContract.Prescription memory prescription = healthRecord.getPrescription(PRESCRIPTION_NAME);

        assertEq(prescription.prescriptionName, PRESCRIPTION_NAME);
        assertEq(prescription.prescriptionDataHash, PRESCRIPTION_HASH);
    }

    function test_AddReport() public {
        vm.prank(owner);
        healthRecord.addReport(REPORT_NAME, REPORT_HASH);

        vm.prank(owner);
        HealthRecordContract.Report memory report = healthRecord.getReport(REPORT_NAME);

        assertEq(report.reportName, REPORT_NAME);
        assertEq(report.reportDataHash, REPORT_HASH);
    }

    function test_AddBill() public {
        vm.prank(owner);
        healthRecord.addBill(BILL_NAME, BILL_HASH);

        vm.prank(owner);
        HealthRecordContract.Bill memory bill = healthRecord.getBill(BILL_NAME);

        assertEq(bill.billName, BILL_NAME);
        assertEq(bill.billDataHash, BILL_HASH);
    }

    // Test access control
    function test_RequestAccess() public {
        vm.prank(requester1);
        healthRecord.requestAccess();

        // We don't have a direct way to verify the request was created,
        // but we can test that a subsequent approval works
        uint256[] memory prescriptionIds = new uint256[](0);
        uint256[] memory reportIds = new uint256[](0);
        uint256[] memory billIds = new uint256[](0);

        vm.prank(owner);
        healthRecord.approveAccess(requester1, 86400, prescriptionIds, reportIds, billIds);

        vm.prank(requester1);
        bool hasExpired = healthRecord.hasAccessExpired();

        assertFalse(hasExpired);
    }

    function test_ApproveAndRevokeAccess() public {
        // Request access
        vm.prank(requester1);
        healthRecord.requestAccess();

        // Add some records first
        vm.startPrank(owner);
        healthRecord.addPrescription(PRESCRIPTION_NAME, PRESCRIPTION_HASH);
        healthRecord.addReport(REPORT_NAME, REPORT_HASH);
        healthRecord.addBill(BILL_NAME, BILL_HASH);
        vm.stopPrank();

        // Prepare IDs for approval
        uint256[] memory prescriptionIds = new uint256[](1);
        prescriptionIds[0] = 0;
        uint256[] memory reportIds = new uint256[](1);
        reportIds[0] = 0;
        uint256[] memory billIds = new uint256[](1);
        billIds[0] = 0;

        // Approve access
        vm.prank(owner);
        healthRecord.approveAccess(requester1, 86400, prescriptionIds, reportIds, billIds);

        // Verify access works
        vm.prank(requester1);
        (
            HealthRecordContract.Prescription[] memory prescriptions,
            HealthRecordContract.Report[] memory reports,
            HealthRecordContract.Bill[] memory bills
        ) = healthRecord.getApprovedRecords();

        assertEq(prescriptions.length, 1);
        assertEq(reports.length, 1);
        assertEq(bills.length, 1);

        assertEq(prescriptions[0].prescriptionName, PRESCRIPTION_NAME);
        assertEq(reports[0].reportName, REPORT_NAME);
        assertEq(bills[0].billName, BILL_NAME);

        // Revoke access
        vm.prank(owner);
        healthRecord.revokeAccess(requester1);

        // Verify access is revoked
        vm.prank(requester1);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__RequesterNotAuthorized.selector);
        healthRecord.getApprovedRecords();
    }

    // Test access expiry
    function test_AccessExpiry() public {
        // Request access
        vm.prank(requester1);
        healthRecord.requestAccess();

        // Approve with short expiry
        uint256[] memory emptyArray = new uint256[](0);
        vm.prank(owner);
        healthRecord.approveAccess(requester1, 1, emptyArray, emptyArray, emptyArray);

        // Verify access is valid
        vm.prank(requester1);
        bool hasExpired = healthRecord.hasAccessExpired();
        assertFalse(hasExpired);

        // Move time forward
        vm.warp(block.timestamp + 2);

        // Verify access has expired
        vm.prank(requester1);
        hasExpired = healthRecord.hasAccessExpired();
        assertTrue(hasExpired);

        // Verify can't access records
        vm.prank(requester1);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__AccessExpired.selector);
        healthRecord.getApprovedRecords();
    }

    // Test extension request functionality (replacing the problematic test_ExtendAccess)
    function test_RequestAndApproveExtendAccess() public {
        // Request access
        vm.prank(requester1);
        healthRecord.requestAccess();

        // Approve access with short expiry
        uint256[] memory emptyArray = new uint256[](0);
        vm.prank(owner);
        healthRecord.approveAccess(requester1, 100, emptyArray, emptyArray, emptyArray);

        // Fast forward but not beyond expiry
        vm.warp(block.timestamp + 50);

        // Request extension
        vm.prank(requester1);
        healthRecord.requestExtendAccess(200);

        // Check extension request exists
        vm.prank(owner);
        (bool exists, uint256 additionalTime,) = healthRecord.checkExtensionRequest(requester1);
        assertTrue(exists);
        assertEq(additionalTime, 200);

        // Approve extension
        vm.prank(owner);
        healthRecord.approveExtendAccess(requester1);

        // Fast forward beyond original expiry but not beyond extended expiry
        vm.warp(block.timestamp + 100); // Total time passed: 150, original expiry: 100, new expiry: 300

        // Verify access still valid
        vm.prank(requester1);
        bool hasExpired = healthRecord.hasAccessExpired();
        assertFalse(hasExpired);

        // Verify extension request was processed (no longer exists)
        vm.prank(owner);
        (exists,,) = healthRecord.checkExtensionRequest(requester1);
        assertFalse(exists);
    }

    // Test unauthorized extension request
    function test_UnauthorizedExtensionRequest() public {
        vm.prank(requester1);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__RequesterNotAuthorized.selector);
        healthRecord.requestExtendAccess(100);
    }

    // Test approving non-existent extension request
    function test_ApproveNonExistentExtensionRequest() public {
        // First authorize requester1
        vm.prank(requester1);
        healthRecord.requestAccess();

        uint256[] memory emptyArray = new uint256[](0);
        vm.prank(owner);
        healthRecord.approveAccess(requester1, 100, emptyArray, emptyArray, emptyArray);

        // Try to approve non-existent extension request
        vm.prank(owner);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__NoExtensionRequestFound.selector);
        healthRecord.approveExtendAccess(requester1);

        // Now create an extension request
        vm.prank(requester1);
        healthRecord.requestExtendAccess(200);

        // Approve it
        vm.prank(owner);
        healthRecord.approveExtendAccess(requester1);

        // Try to approve it again (should fail since it's already processed)
        vm.prank(owner);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__NoExtensionRequestFound.selector);
        healthRecord.approveExtendAccess(requester1);
    }

    // Test requesting extension after access has expired
    function test_RequestExtendAccessAfterExpiry() public {
        // Request access
        vm.prank(requester1);
        healthRecord.requestAccess();

        // Approve with short expiry
        uint256[] memory emptyArray = new uint256[](0);
        vm.prank(owner);
        healthRecord.approveAccess(requester1, 10, emptyArray, emptyArray, emptyArray);

        // Verify access is initially valid
        vm.prank(requester1);
        bool hasExpired = healthRecord.hasAccessExpired();
        assertFalse(hasExpired);

        // Fast forward beyond expiry
        vm.warp(block.timestamp + 20);

        // Verify access has expired
        vm.prank(requester1);
        hasExpired = healthRecord.hasAccessExpired();
        assertTrue(hasExpired);

        // Request extension after expiry (should work now)
        vm.prank(requester1);
        healthRecord.requestExtendAccess(100);

        // Check extension request exists
        vm.prank(owner);
        (bool exists, uint256 additionalTime,) = healthRecord.checkExtensionRequest(requester1);
        assertTrue(exists);
        assertEq(additionalTime, 100);

        // Approve extension
        vm.prank(owner);
        healthRecord.approveExtendAccess(requester1);

        // Verify access is valid again
        vm.prank(requester1);
        hasExpired = healthRecord.hasAccessExpired();
        assertFalse(hasExpired);

        // Verify can access records again
        vm.prank(requester1);
        healthRecord.getApprovedRecords(); // This would revert if access was still expired
    }

    // Test unauthorized access
    function test_UnauthorizedUpdates() public {
        vm.prank(requester1);
        vm.expectRevert();
        healthRecord.updatePatientName("Hacker");

        vm.prank(requester1);
        vm.expectRevert();
        healthRecord.addPrescription(PRESCRIPTION_NAME, PRESCRIPTION_HASH);

        vm.prank(requester1);
        vm.expectRevert();
        healthRecord.getPatientDetails();
    }

    // Test non-existent record retrieval
    function test_GetInvalidRecords() public {
        vm.prank(owner);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__InvalidPrescription.selector);
        healthRecord.getPrescription("nonexistent");

        vm.prank(owner);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__InvalidReport.selector);
        healthRecord.getReport("nonexistent");

        vm.prank(owner);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__InvalidBill.selector);
        healthRecord.getBill("nonexistent");
    }

    // Test approving non-existent request
    function test_ApproveNonExistentRequest() public {
        uint256[] memory emptyArray = new uint256[](0);

        vm.prank(owner);
        vm.expectRevert(HealthRecordContract.HealthRecordContract__NoRequestFound.selector);
        healthRecord.approveAccess(requester2, 0, emptyArray, emptyArray, emptyArray);
    }
}
