import { LinkIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function MetaMaskConnectorComponent({ onConnect }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isMetaMaskConnected, setMetaMaskConnected] = useState(false);

  const connectToMetaMask = () => {
    if (window.ethereum) {
      window.ethereum.enable()
        .then(
          accounts => {
            const address = accounts[0];
            const connection = true;
            setWalletAddress(address);
            setMetaMaskConnected(connection);
            onConnect(address, connection);
          }
        ).catch(
          error => {
            console.error(error);
          }
        );
    } else {
      console.error("MetaMask not installed.")
    }
  }

  useEffect(() => {
    connectToMetaMask();
  }, []);

  return (
    <>
      {
        isMetaMaskConnected ? (
          <Flex direction="row" align="center" gap="2">
            <Text>Wallet: </Text>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <LinkIcon color='gray.300' />
              </InputLeftElement>
              <Input size="md" htmlSize={40} width='md' type='text' isReadOnly="true" value={walletAddress}/>
            </InputGroup>
          </Flex>
        ) : (
          <Flex direction="row" align="center" gap="2">
            <Spinner/>
            <Text>Connecting to MetaMask</Text>
          </Flex>
        )
      }
    </>
  );
}

export default MetaMaskConnectorComponent;