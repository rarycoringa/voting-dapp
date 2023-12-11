import { Box, Divider, Flex, Heading, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import MetaMaskConnectorComponent from "./components/MetaMaskConnectorComponent";
import OwnerToolsComponent from "./components/OwnerToolsComponent"
import VoteComponent from "./components/VoteComponent"
import VotingResultComponent from "./components/VotingResultComponent"

function VotingDApp() {
  const votingDAppAddress = "0x2d6093a73546cb8a21a19227a1b7c9f1d3f81781";

  const [walletAddress, setWalletAddress] = useState(null);

  const [isMetaMaskConnected, setMetaMaskConnected] = useState(false);
  const [isVotingStarted, setVotingStarted] = useState(false);
  const [isVotingFinished, setVotingFinished] = useState(false);
  const [isOwnerConnected, setIsOwnerConnected] = useState(false);


  const handleMetaMaskConnection = (address, connection) => {
    setWalletAddress(address);
    setMetaMaskConnected(connection);
  };

  return (
    <Flex minWidth="max-content" minHeight="max-content" direction="column" mx="60">
      <Flex minWidth="max-content" alignItems='center' gap='2' my="5">
        <Box>
          <Heading>Voting DApp</Heading>
        </Box>
        <Spacer />
        <Box>
          <MetaMaskConnectorComponent onConnect={handleMetaMaskConnection} />
        </Box>
      </Flex>
      
      <Divider />

      <Flex minWidth="max-content" alignItems="center" my="5" direction="column">
        <OwnerToolsComponent />
        <VoteComponent />
        <Divider />
        <VotingResultComponent />
        <Divider />
      </Flex>

    </Flex>
    
  );
}

export default VotingDApp;
