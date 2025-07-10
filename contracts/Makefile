# Variables
-include .env

.PHONY: all test clean deploy interact help

# Default target
all: help

# Help message
help:
	@echo "Health Records Onchain - Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make test                  - Run all tests"
	@echo "  make test-coverage         - Run tests with coverage report"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-anvil          - Deploy to local Anvil chain"
	@echo "  make deploy-sepolia        - Deploy to Sepolia testnet"
	@echo "  make deploy-base-sepolia   - Deploy to Base Sepolia testnet"
	@echo "  make deploy-arbitrum       - Deploy to Arbitrum One"
	@echo "  make deploy-arbitrum-sepolia - Deploy to Arbitrum Sepolia"
	@echo "  make deploy-avalanche      - Deploy to Avalanche C-Chain"
	@echo "  make deploy-avalanche-fuji - Deploy to Avalanche Fuji testnet"
	@echo "  make deploy-optimism       - Deploy to Optimism"
	@echo "  make deploy-optimism-sepolia - Deploy to Optimism Sepolia"
	@echo "  make deploy-mainnet        - Deploy to Ethereum mainnet"
	@echo ""
	@echo "Patient Management:"
	@echo "  make create-patient        - Create a new patient record"
	@echo "  make update-patient        - Update patient information"
	@echo ""
	@echo "Medical Records:"
	@echo "  make add-prescription      - Add a prescription record"
	@echo "  make add-report            - Add a medical report"
	@echo "  make add-bill              - Add a medical bill"
	@echo ""
	@echo "Access Control:"
	@echo "  make request-access        - Request access to patient records"
	@echo "  make approve-access        - Approve access request"
	@echo "  make revoke-access         - Revoke access"
	@echo "  make request-extend        - Request access extension"
	@echo "  make approve-extend        - Approve access extension"
	@echo ""
	@echo "View Functions:"
	@echo "  make view-patient          - View patient details"
	@echo "  make view-records          - View approved records"
	@echo "  make check-access          - Check if access has expired"
	@echo "  make check-extension       - Check extension requests"
	@echo "  make list-patients         - List all patients in the factory"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean                 - Remove build artifacts"

# Clean build artifacts
clean:
	@forge clean
	@echo "Build artifacts removed"

# Test targets
test:
	@forge test -vv

test-coverage:
	@forge coverage --report lcov

# Deployment targets
deploy-anvil:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url http://localhost:8545 --broadcast -vv

deploy-sepolia:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv

deploy-base-sepolia:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(BASE_SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(BASE_SCAN_API_KEY) -vvvv

deploy-arbitrum:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(ARBITRUM_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ARBISCAN_API_KEY) -vvvv

deploy-arbitrum-sepolia:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(ARBITRUM_SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ARBISCAN_API_KEY) -vvvv

deploy-avalanche:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(AVALANCHE_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(SNOWTRACE_API_KEY) -vvvv

deploy-avalanche-fuji:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(AVALANCHE_FUJI_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(SNOWTRACE_API_KEY) -vvvv

deploy-optimism:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(OPTIMISM_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(OPTIMISM_API_KEY) -vvvv

deploy-optimism-sepolia:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(OPTIMISM_SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(OPTIMISM_API_KEY) -vvvv

deploy-mainnet:
	@forge script script/DeployHealthRecordFactory.s.sol --rpc-url $(MAINNET_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv

# Patient Management
create-patient:
	@forge script script/Interactions.s.sol --sig "createPatient(string,uint256,uint256,string,uint256,uint256,string)" "$(NAME)" $(ID) $(AGE) "$(GENDER)" $(HEIGHT) $(WEIGHT) "$(BLOOD_GROUP)" --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

update-patient:
	@forge script script/Interactions.s.sol --sig "updatePatientInfo(address,string,uint256,string,uint256,uint256,string)" $(CONTRACT_ADDRESS) "$(NAME)" $(AGE) "$(GENDER)" $(HEIGHT) $(WEIGHT) "$(BLOOD_GROUP)" --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

# Medical Records
add-prescription:
	@forge script script/Interactions.s.sol --sig "addPrescription(address,string,string)" $(CONTRACT_ADDRESS) "$(PRESCRIPTION_NAME)" "$(PRESCRIPTION_HASH)" --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

add-report:
	@forge script script/Interactions.s.sol --sig "addReport(address,string,string)" $(CONTRACT_ADDRESS) "$(REPORT_NAME)" "$(REPORT_HASH)" --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

add-bill:
	@forge script script/Interactions.s.sol --sig "addBill(address,string,string)" $(CONTRACT_ADDRESS) "$(BILL_NAME)" "$(BILL_HASH)" --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

# Access Control
request-access:
	@forge script script/Interactions.s.sol --sig "requestAccess(address)" $(CONTRACT_ADDRESS) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

approve-access:
	@forge script script/Interactions.s.sol --sig "approveAccess(address,address,uint256,uint256[],uint256[],uint256[])" $(CONTRACT_ADDRESS) $(REQUESTER_ADDRESS) $(EXPIRY_DURATION) "[$(PRESCRIPTION_IDS)]" "[$(REPORT_IDS)]" "[$(BILL_IDS)]" --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

revoke-access:
	@forge script script/Interactions.s.sol --sig "revokeAccess(address,address)" $(CONTRACT_ADDRESS) $(REQUESTER_ADDRESS) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

request-extend:
	@forge script script/Interactions.s.sol --sig "requestExtendAccess(address,uint256)" $(CONTRACT_ADDRESS) $(ADDITIONAL_TIME) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

approve-extend:
	@forge script script/Interactions.s.sol --sig "approveExtendAccess(address,address)" $(CONTRACT_ADDRESS) $(REQUESTER_ADDRESS) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vv

# View Functions
view-patient:
	@forge script script/Interactions.s.sol --sig "getPatientDetails(address)" $(CONTRACT_ADDRESS) --rpc-url $(RPC_URL) -vv

view-records:
	@forge script script/Interactions.s.sol --sig "getApprovedRecords(address)" $(CONTRACT_ADDRESS) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) -vv

check-access:
	@forge script script/Interactions.s.sol --sig "hasAccessExpired(address)" $(CONTRACT_ADDRESS) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) -vv

check-extension:
	@forge script script/Interactions.s.sol --sig "checkExtensionRequest(address,address)" $(CONTRACT_ADDRESS) $(REQUESTER_ADDRESS) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) -vv

list-patients:
	@forge script script/Interactions.s.sol --sig "getAllPatients()" --rpc-url $(RPC_URL) -vv
