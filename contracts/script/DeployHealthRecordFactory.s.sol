// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {HealthRecordFactory} from "../src/HealthRecordContractFactory.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

/**
 * @title DeployHealthRecordFactory
 * @notice Deploys the HealthRecordFactory contract
 */
contract DeployHealthRecordFactory is Script {
    function run() external returns (HealthRecordFactory, HelperConfig) {
        HelperConfig config = new HelperConfig();

        vm.startBroadcast();
        HealthRecordFactory factory = new HealthRecordFactory();
        vm.stopBroadcast();

        return (factory, config);
    }
}
