import { AddIcon, CheckIcon, CopyIcon, SpinnerIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, Input, InputGroup, InputRightElement, Spacer, Stack, Text} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

function OwnerToolsComponent({ contract, fromAddress, onStatus }) {
    const [voters, setVoters] = useState([]);
    const [candidates, setCandidates] = useState([]);
    
    const voterAddressRef = useRef();
    const [addVoterIsLoading, setAddVoterIsLoading] = useState(false);

    const candidateAddressRef = useRef();
    const [addCandidateIsLoading, setAddCandidateIsLoading] = useState(false);

    const [startVotingIsLoading, setStartVotingIsLoading] = useState(false)
    const [finishVotingIsLoading, setFinishVotingIsLoading] = useState(false)
    const [isStarted, setStarted] = useState(false);
    const [isFinished, setFinished] = useState(false);

    const addVoter = async () => {
        setAddVoterIsLoading(true);

        const voterAddress = voterAddressRef.current.value;
        const transaction = await contract.methods.registerVoter(voterAddress).send({"from": fromAddress});
        
        await retrieveVoters();
        
        voterAddressRef.current.value = "";
        setAddVoterIsLoading(false);

        console.log(`Voter ${voterAddress} successfully added by ${fromAddress} in transaction ${transaction}`);
    };

    const retrieveVoters = async () => {
        const result = await contract.methods.getVoters().call();
        setVoters(result);

        console.log(`Voters successfully retrieved: ${result}`);
    };

    const addCandidate = async () => {
        setAddCandidateIsLoading(true);

        const candidateAddress = candidateAddressRef.current.value;
        const transaction = await contract.methods.registerCandidate(candidateAddress).send({"from": fromAddress});
        
        await retrieveCandidates();
        
        candidateAddressRef.current.value = "";
        setAddCandidateIsLoading(false);

        console.log(`Candidate ${candidateAddress} successfully added by ${fromAddress} in transaction ${transaction}`);
    };

    const retrieveCandidates = async () => {
        const result = await contract.methods.getCandidates().call();
        setCandidates(result);

        console.log(`Candidates successfully retrieved: ${result}`);
    };
    
    const startVoting = async () => {
        setStartVotingIsLoading(true);

        const transaction = await contract.methods.startVotingProcess().send({"from": fromAddress});

        await retrieveVotingStatus();

        onStatus(isStarted, isFinished);

        setStartVotingIsLoading(false);

        console.log(`Voting process successfully started by ${fromAddress} in transaction ${transaction}`);
    }

    const finishVoting = async () => {
        setFinishVotingIsLoading(true);

        const transaction = await contract.methods.finishVotingProcess().send({"from": fromAddress});

        await retrieveVotingStatus();

        onStatus(isStarted, isFinished);

        setFinishVotingIsLoading(false);

        console.log(`Voting process successfully finished by ${fromAddress} in transaction ${transaction}`);
    }

    const retrieveVotingStatus = async () => {
        setStartVotingIsLoading(true);
        setFinishVotingIsLoading(true);

        const startedAt = await contract.methods.getStartedAt().call();
        const finishedAt = await contract.methods.getFinishedAt().call();

        setStarted(startedAt !== 0n);
        setFinished(finishedAt !== 0n);

        onStatus(isStarted, isFinished);

        setStartVotingIsLoading(false);
        setFinishVotingIsLoading(false);

        console.log(`Voting status successfully retrieved with startedAt = ${startedAt} and finishedAt = ${finishedAt}`);
    }

    useEffect(() => {
            retrieveVoters();
            retrieveCandidates();
            retrieveVotingStatus();
        },
        []
    );

    return (
        <>
            <Heading as="h1" size="lg">Owner Tools</Heading>

            <Divider my="15"/>
                
            <Flex minWidth="max-content" justifyContent="center" direction="row" gap="10">
                <Card minWidth="400px" px="5">
                    <CardHeader>
                        <Heading as="h2" size="md">Voters</Heading>
                    </CardHeader>

                    <Divider color="lightgray"/>

                    <CardBody flexDirection="column" gap="15">
                        <Heading as="h3" size="sm">Voters:</Heading>
                        <Stack spacing="5" mt="3">
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

                    <CardFooter flexDirection="column" gap="15">
                        <Heading as="h3" size="sm">Add voter:</Heading>
                        <InputGroup>
                            <Input type="text" ref={voterAddressRef} isDisabled={isStarted} placeholder="0x0000000000000000000000000000000000000000" />
                            <InputRightElement>
                                <Button isLoading={addVoterIsLoading} isDisabled={isStarted} onClick={addVoter}>
                                    <AddIcon size="sm" />
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </CardFooter>
                </Card>

                <Card minWidth="400px" px="5">
                    <CardHeader>
                        <Heading as="h2" size="md">Candidates</Heading>
                    </CardHeader>

                    <Divider color="lightgray"/>

                    <CardBody flexDirection="column" gap="15">
                        <Heading as="h3" size="sm">Candidates:</Heading>
                        <Stack spacing="5" mt="3">
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

                    <CardFooter flexDirection="column" gap="15">
                        <Heading as="h3" size="sm">Add candidate:</Heading>
                        <InputGroup>
                            <Input type="text" ref={candidateAddressRef} isDisabled={isStarted} placeholder="0x0000000000000000000000000000000000000000" />
                            <InputRightElement>
                                <Button isLoading={addCandidateIsLoading} isDisabled={isStarted} onClick={addCandidate}>
                                    <AddIcon size="sm" />
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </CardFooter>
                </Card>
            </Flex>
            
            <Divider my="15"/>

            <Flex minWidth="max-content" justifyContent="center" direction="row" gap="10">
                <ButtonGroup>
                    <Button
                        minWidth="400px" mx="8"
                        onClick={startVoting}
                        isLoading={startVotingIsLoading}
                        loadingText="Starting Voting"
                        isDisabled={isStarted}
                    >
                        { !isStarted ? ("Start Voting") : "Voting Started"}
                    </Button>
                    
                    <Spacer />
                    
                    <Button
                        minWidth="400px" mx="8"
                        onClick={finishVoting}
                        isLoading={finishVotingIsLoading}
                        loadingText="Finishing Voting"
                        isDisabled={isFinished}
                    >
                        { !isFinished ? ("Finish Voting") : "Voting Finished"}
                    </Button>
                </ButtonGroup>
            </Flex>

            <Divider my="15"/>
        </>
    );
}

export default OwnerToolsComponent;