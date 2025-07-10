// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";

/**
 * @title HelperConfig
 * @notice Configuration helper for different networks
 */
contract HelperConfig is Script {
    struct NetworkConfig {
        address deployer;
    }

    NetworkConfig public activeNetworkConfig;

    // Chain IDs
    uint256 public constant ANVIL_CHAIN_ID = 31337;
    uint256 public constant SEPOLIA_CHAIN_ID = 11155111;
    uint256 public constant BASE_SEPOLIA_CHAIN_ID = 84532;
    uint256 public constant ARBITRUM_ONE_CHAIN_ID = 42161;
    uint256 public constant ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
    uint256 public constant AVALANCHE_C_CHAIN_ID = 43114;
    uint256 public constant AVALANCHE_FUJI_CHAIN_ID = 43113;
    uint256 public constant OPTIMISM_CHAIN_ID = 10;
    uint256 public constant OPTIMISM_SEPOLIA_CHAIN_ID = 11155420;

    address public constant DEFAULT_ANVIL_ADDRESS = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    constructor() {
        if (block.chainid == ANVIL_CHAIN_ID) {
            activeNetworkConfig = getAnvilConfig();
        } else if (block.chainid == SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getSepoliaConfig();
        } else if (block.chainid == BASE_SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getBaseSepoliaConfig();
        } else if (block.chainid == ARBITRUM_ONE_CHAIN_ID) {
            activeNetworkConfig = getArbitrumConfig();
        } else if (block.chainid == ARBITRUM_SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getArbitrumSepoliaConfig();
        } else if (block.chainid == AVALANCHE_C_CHAIN_ID) {
            activeNetworkConfig = getAvalancheConfig();
        } else if (block.chainid == AVALANCHE_FUJI_CHAIN_ID) {
            activeNetworkConfig = getAvalancheFujiConfig();
        } else if (block.chainid == OPTIMISM_CHAIN_ID) {
            activeNetworkConfig = getOptimismConfig();
        } else if (block.chainid == OPTIMISM_SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getOptimismSepoliaConfig();
        } else {
            activeNetworkConfig = getDefaultConfig();
        }
    }

    function getAnvilConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({deployer: DEFAULT_ANVIL_ADDRESS});
    }

    function getSepoliaConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployer: msg.sender});
    }

    function getBaseSepoliaConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployer: msg.sender});
    }

    function getArbitrumConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployer: msg.sender});
    }

    function getArbitrumSepoliaConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployer: msg.sender});
    }

    function getAvalancheConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployer: msg.sender});
    }

    function getAvalancheFujiConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployer: msg.sender});
    }

    function getOptimismConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployer: msg.sender});
    }

    function getOptimismSepoliaConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployer: msg.sender});
    }

    function getDefaultConfig() public view returns (NetworkConfig memory) {
        // Default to using msg.sender
        return NetworkConfig({deployer: msg.sender});
    }
}
