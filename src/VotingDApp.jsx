import { Box, Divider, Flex, Heading, Progress, Skeleton, Spacer, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MetaMaskConnectorComponent from "./components/MetaMaskConnectorComponent";
import OwnerToolsComponent from "./components/OwnerToolsComponent";
import VoteComponent from "./components/VoteComponent";
import VotingResultComponent from "./components/VotingResultComponent";
import Web3 from "web3";

import votingDAppABI from "./contracts/VotingDAppABI.json";

function VotingDApp() {
  const web3 = new Web3(window.ethereum);
  const votingDAppAddress = "0x055695240ddbdae548d566e994d44364928fed23";
  const votingDAppOwnerAddress = "0x12287320fd25d88abce37fb524b54ca49b573726";

  const votingDAppContract = new web3.eth.Contract(votingDAppABI, votingDAppAddress)

  const [walletAddress, setWalletAddress] = useState(null);

  const [isMetaMaskConnected, setMetaMaskConnected] = useState(false);
  const [isVotingStarted, setVotingStarted] = useState(false);
  const [isVotingFinished, setVotingFinished] = useState(false);

  const handleMetaMaskConnection = (address, connection) => {
    setWalletAddress(address);
    setMetaMaskConnected(connection);
  };

  const handleVotingStatus = (started, finished) => {
    setVotingStarted(started);
    setVotingFinished(finished);
  };

  return (
    <Flex minWidth="max-content" minHeight="max-content" direction="column" mx="60">
      <Flex minWidth="max-content" alignItems='center' gap='2' my="5">
        <Box>
          <Heading as="h1" size="xl">Voting DApp</Heading>
        </Box>
        <Spacer />
        <Box>
          <MetaMaskConnectorComponent onConnect={handleMetaMaskConnection} />
        </Box>
      </Flex>

      <Divider />

      {
        isMetaMaskConnected ? (
          <Flex minWidth="max-content" alignItems="center" my="5" direction="column" gap="15">
            <VotingResultComponent
              contract={votingDAppContract}
              changeStatus={handleVotingStatus}
            />

            <Divider />

            {
              walletAddress === votingDAppOwnerAddress ? (
                <OwnerToolsComponent
                  contract={votingDAppContract}
                  fromAddress={walletAddress}
                  changeStatus={handleVotingStatus}
                />
              ) : (
                <VoteComponent />
              )
            }
          </Flex>
        ) : (
          <Flex minWidth="max-content" alignItems="center" my="350" direction="column">
            {/* <Progress size='lg' isIndeterminate /> */}
            <Spinner color="gray" size="xl"/>
          </Flex>
        )
      }
      

    </Flex>
    
  );
}

export default VotingDApp;
