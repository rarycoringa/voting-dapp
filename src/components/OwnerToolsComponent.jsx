import { AddIcon, CheckIcon, CopyIcon, SpinnerIcon } from "@chakra-ui/icons";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, Input, InputGroup, InputRightElement, Spacer, Stack} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

function OwnerToolsComponent({ contract, fromAddress }) {
    const [voters, setVoters] = useState([]);
    const [candidates, setCandidates] = useState([]);
    
    const voterAddressRef = useRef();
    const [addVoterIcon, setAddVoterIcon] = useState(<AddIcon size="sm" />);

    const candidateAddressRef = useRef();
    const [addCandidateIcon, setAddCandidateIcon] = useState(<AddIcon size="sm" />);

    const handleAddVoter = async () => {
        setAddVoterIcon(<SpinnerIcon size="sm" />);

        const voterAddress = voterAddressRef.current.value;
        const transaction = await contract.methods.registerVoter(voterAddress).send({"from": fromAddress});
        
        voterAddressRef.current.value = "";
        setAddVoterIcon(<AddIcon size="sm" />);

        retrieveVoters();

        console.log(`Voter ${voterAddress} successfully added by ${fromAddress} in transaction ${transaction}`);
    };

    const retrieveVoters = async () => {
        const result = await contract.methods.getVoters().call();
        setVoters(result);

        console.log(`Voters successfully retrieved: ${result}`);
    };

    const handleAddCandidate = async () => {
        setAddCandidateIcon(<SpinnerIcon size="sm" />);

        const candidateAddress = candidateAddressRef.current.value;
        const transaction = await contract.methods.registerCandidate(candidateAddress).send({"from": fromAddress});
        
        candidateAddressRef.current.value = "";
        setAddCandidateIcon(<AddIcon size="sm" />);

        retrieveCandidates();

        console.log(`Candidate ${candidateAddress} successfully added by ${fromAddress} in transaction ${transaction}`);
    };

    const retrieveCandidates = async () => {
        const result = await contract.methods.getCandidates().call();
        setCandidates(result);

        console.log(`Candidates successfully retrieved: ${result}`);
    };

    useEffect(() => {
            retrieveVoters();
            retrieveCandidates();
        },
        []
    );

    return (
        <>
            <Heading as="h1" size="xl">Owner Tools</Heading>

            <Divider my="15"/>
            
            <Flex minWidth="max-content" justifyContent="center" direction="row" gap="10">
                <Card minWidth="400px" px="5">
                    <CardHeader>
                        <Heading as="h2" size="lg">Voters</Heading>
                    </CardHeader>

                    <Divider color="lightgray"/>

                    <CardBody>
                        <Stack spacing="5">
                            {
                                voters.map(
                                    (voterAddress, index) => (
                                        <InputGroup>
                                            <Input type="text" value={voterAddress} isReadOnly={true}/>
                                            <InputRightElement>
                                                <Button>
                                                    <CopyIcon />
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    )
                                )
                            }
                        </Stack>
                        
                    </CardBody>

                    <Divider color="lightgray"/>

                    <CardFooter>
                        <InputGroup>
                            <Input type="text" ref={voterAddressRef} placeholder="0x0000000000000000000000000000000000000000" />
                            <InputRightElement>
                                <Button onClick={handleAddVoter}>
                                    { addVoterIcon }
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </CardFooter>
                </Card>

                <Card minWidth="400px" px="5">
                    <CardHeader>
                        <Heading as="h2" size="lg">Candidates</Heading>
                    </CardHeader>

                    <Divider color="lightgray"/>

                    <CardBody>
                        <Stack spacing="5">
                            {
                                candidates.map(
                                    (candidateAddress, index) => (
                                        <InputGroup>
                                            <Input type="text" value={candidateAddress} isReadOnly={true}/>
                                            <InputRightElement>
                                                <Button>
                                                    <CopyIcon />
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    )
                                )
                            }
                        </Stack>
                        
                    </CardBody>

                    <Divider color="lightgray"/>

                    <CardFooter>
                        <InputGroup>
                            <Input type="text" ref={candidateAddressRef} placeholder="0x0000000000000000000000000000000000000000" />
                            <InputRightElement>
                                <Button onClick={handleAddCandidate}>
                                    { addCandidateIcon }
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </CardFooter>
                </Card>
            </Flex>
            
        </>
    );
}

export default OwnerToolsComponent;