import { LinkIcon } from "@chakra-ui/icons";
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Input, InputGroup, InputLeftElement, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function MetaMaskConnector({ onConnect }) {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const connectToMetaMask = () => {
    if (window.ethereum) {
      window.ethereum.enable()
        .then(
          accounts => {
            const address = accounts[0];
            setSelectedAddress(address);
            onConnect(address);
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
    <Card align="center">
      <CardHeader>
        <Heading>Connect to MetaMask Wallet</Heading>
      </CardHeader>
        {
          selectedAddress ? (
            <CardBody>
              <Text>Connected wallet address:</Text>
              <InputGroup>
                <InputLeftElement pointerEvents='none'>
                  <LinkIcon color='gray.300' />
                </InputLeftElement>
                <Input htmlSize={50} width='auto' type='text' isReadOnly="true" value={selectedAddress}/>
              </InputGroup>
            </CardBody>
          ) : (
            <CardBody align="center">
              <Spinner/>
              <Text>Connecting to MetaMask...</Text>
            </CardBody>
          )
        }
      <CardFooter>
          <Button onClick={onNext}>Next</Button>
      </CardFooter>
    </Card>
  );
}

export default MetaMaskConnector;